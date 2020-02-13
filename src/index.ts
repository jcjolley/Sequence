import {isIterable} from "./utilities";

export class Sequence<T> {
    * [Symbol.iterator](): Generator<T, void, undefined> {
    }

    constructor(generatorFn: () => Generator<T, void, undefined>) {
        if (typeof generatorFn === "function") {
            this[Symbol.iterator] = generatorFn;
        } else {
            throw new Error("Cannot create Sequence from provided argument");
        }
    }

    static of<T>(obj: Iterable<T>): Sequence<T> {
        return new Sequence(function* (): Generator<T, void, undefined> {
            for (const x of obj[Symbol.iterator]() as any) {
                yield x;
            }
        })
    }

    static fromObj(obj: any): Sequence<[string, unknown]> {
        const entries = Object.entries(obj);
        return new Sequence(function* (): Generator<[string, unknown], void, undefined> {
            for (const [key, value] of entries) {
                yield [key, value]
            }
        });
    }

    map<R>(fn: (x: T) => R): Sequence<R> {
        const genFn = this[Symbol.iterator];
        return new Sequence<R>(function* (): Generator<R, void, undefined> {
            for (const x of genFn()) {
                yield fn(x);
            }
        });
    }

    first(): undefined | T {
        let gen = this[Symbol.iterator]();
        const {value} = gen.next();
        return value as undefined | T;
    }

    second(): undefined | T {
        return this.next().first();
    }

    rest(start = 1): Sequence<T> {
        const seq = this;
        return new Sequence(function* (): Generator<T, void, undefined> {
            for (const x of seq) {
                if (start === 0) {
                    yield x;
                } else {
                    start--;
                }
            }
        });
    }

    drop(n: number): Sequence<T> {
        return this.rest(n);
    }

    dropWhile(pred: (x: T) => boolean): Sequence<T> {
        const seq = this;
        let n = 0;
        for (const x of seq) {
            if (pred(x)) n++;
            else return this.rest(n);
        }
    }

    next(): Sequence<T> {
        return this.rest();
    }

    reduce(fn: (acc: any, x: T) => any, initial?: any) {
        let acc;
        if (initial) {
            acc = initial;
            for (const x of this.rest()) {
                acc = fn(acc, x);
            }
        } else {
            acc = this.fold(fn)
        }
        return acc;
    }

    fold(fn: (acc: any, x: T) => any){
        let acc = this.first();
        for (const x of this.rest()) {
            acc = fn(acc, x)
        }
        return acc
    }

    filter(pred: (x: T) => boolean): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            for (const x of seq) {
                if (pred(x)) {
                    yield x;
                }
            }
        });
    }

    take(n: number): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            let num = n;
            for (const x of seq) {
                if (num > 0) {
                    num--;
                    yield x;
                } else {
                    return;
                }
            }
        })
    }

    takeWhile(pred: (x: T) => boolean): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            for (const x of seq) {
                if (pred(x)) {
                    yield x;
                } else {
                    return;
                }
            }
        });
    }

    takeLast(n: number): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            let length = 0;
            for (const x of seq) {
                length++;
            }

            let start = length - n;
            let i = 0;
            for (const x of seq) {
                i++;
                if (i >= start) {
                    yield x;
                }
            }
        });
    }


    flatten(flattenStr: boolean = false): Sequence<any> {
        const seq = this;
        return new Sequence(function* () {
            for (const x of seq) {
                if (!isIterable(x, flattenStr)) {
                    yield x;
                } else {
                    const xs = Sequence.of(x as any);
                    for (const y of xs.flatten(flattenStr)) {
                        yield y;
                    }
                }
            }
        });
    }

    distinct(): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            const previouslySeen = new Set();
            for (const x of seq) {
                if (!previouslySeen.has(x)) {
                    previouslySeen.add(x);
                    yield x;
                }
            }
        });
    }

    remove(pred: (x: T) => boolean): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            for (const x of seq) {
                if (!pred(x)) {
                    yield x;
                }
            }
        });
    }

    prepend(x: T): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            yield x;
            for (const x of seq) yield x;
        });
    }

    append(x: T): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            for (const x of seq) {yield x}
            yield x;
        });
    }

    concat(xs: Iterable<T>): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            for (const x of seq) yield x;
            for (const x of xs) yield x;
        });
    }

    mapcat<R>(fn: (x: T) => Iterable<R>): Sequence<R> {
        const seq = this;
        return new Sequence(function* () {
            for (const x of seq) {
                const xs = fn(x);
                for (const y of xs) {
                    yield y;
                }
            }
        });
    }

    cycle(): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            let done = false;
            let value = undefined;
            let gen = seq[Symbol.iterator]();
            while (true) {
                ({done, value} = gen.next());
                if (done) {
                    gen = seq[Symbol.iterator]();
                    ({done, value} = gen.next());
                }
                yield value;
            }
        });
    }

    interleave<R>(xs: Iterable<R>): Sequence<T | R> {
        const seq = this;
        return new Sequence(function* () {
            let chooseFirst = true;
            let gen1 = seq[Symbol.iterator]();
            let gen2 = xs[Symbol.iterator]();
            let done, value;
            while (!done) {
                if (chooseFirst) {
                    ({done, value} = gen1.next());
                } else {
                    ({done, value} = gen2.next());
                }
                if (done) return;
                yield value;
                chooseFirst = !chooseFirst;
            }
        });
    }

    interpose(x: T): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            let gen = seq[Symbol.iterator]();
            let curr = gen.next();
            let next = gen.next();
            while (!curr.done) {
                if (!curr.done) {
                    yield curr.value as T;
                }
                if (!next.done) {
                    yield x;
                }
                curr = next;
                next = gen.next();
            }
        });
    }

    toArray(): T[] {
        return [...this]
    }

    toMap<K, V>(): Map<K, V> {
        return new Map(this as any);
    }

    toSet(): Set<T> {
        return new Set(this);
    }

    toObject(): { [key: string]: any } {
        const obj = {};
        for (const [key, value] of this as any) {
            obj[key] = value;
        }
        return obj;
    }
}

