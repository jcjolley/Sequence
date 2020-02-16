import {isIterable, isIterator} from "./utilities";

/** @class Sequence representing a lazy list of values. */
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

    static of<T>(obj: T | Iterable<T>): Sequence<T> {
        if (isIterable<T>(obj)) {
            return new Sequence(function* (): Generator<T, void, undefined> {
                for (const x of obj) {
                    yield x;
                }
            })
        } else {
            return new Sequence(function* (): Generator<T, void, undefined> {
                yield obj;
            })
        }
    }

    static ofItems<T>(...items: Array<T>): Sequence<T> {
        if (arguments.length === 1) {
            return Sequence.of(items[0])
        } else {
            return Sequence.of(items);
        }
    }

    static fromObj(obj: any): Sequence<[string, unknown]> {
        const entries = Object.entries(obj);
        return new Sequence(function* (): Generator<[string, unknown], void, undefined> {
            for (const [key, value] of entries) {
                yield [key, value]
            }
        });
    }

    static range(start = 0, end = Infinity, step = 1): Sequence<number> {
        return new Sequence(function* () {
            let n = start;
            while (n < end) {
                yield n;
                n += step;
            }
        })
    }

    static repeat<T>(x: T, times = Infinity): Sequence<T> {
        return new Sequence(function* () {
            let i = 0;
            while (i < times) {
                yield x;
                i++;
            }
        })
    }

    static iterate(fn: any, arg) {
        return new Sequence(function* () {
            let res = arg;
            while (true) {
                res = fn(res);
                yield res;
            }
        })
    }

    map<R>(fn: (x: T) => R): Sequence<R> {
        const seq = this;
        return new Sequence<R>(function* (): Generator<R, void, undefined> {
            for (const x of seq) {
                yield fn(x);
            }
        });
    }

    mapIndexed<R>(fn: (index: number, x: T) => R): Sequence<R> {
        const seq = this;
        return new Sequence<R>(function* (): Generator<R, void, undefined> {
            let i = 0;
            for (const x of seq) {
                yield fn(i, x);
                i++;
            }
        })
    }

    forEach(fn: (x: T) => any): void {
        for (const x of this) {
            fn(x);
        }
    }

    replace<R>(replacements: Map<T, R>): Sequence<T | R> {
        const seq = this;
        return new Sequence(function* () {
            for (const x of seq) {
                yield replacements.has(x) ? replacements.get(x) : x
            }
        })
    }

    chunk(size: number, step = 1): Sequence<Sequence<T>> {
        const seq = this;
        return new Sequence(function* () {
            let s = step;
            let group = [];
            for (const x of seq) {
                if (group.length < size) {
                    group.push(x)
                } else {
                    if (s > 1) {
                        s--;
                    } else {
                        yield Sequence.of(group);
                        group = [x];
                        s = step;
                    }
                }
            }
        })
    }

    first(): undefined | T {
        let gen = this.toGenerator();
        const {value} = gen.next();
        return value as undefined | T
    }

    second(): undefined | T {
        return this.nth(1)
    }

    nth(n: number): undefined | T {
        let gen = this.toGenerator();
        let i = 0;
        let done = false, value;

        while (!done && i < n) {
            ({done} = gen.next());
            i++;
        }

        ({value} = gen.next());
        return value as undefined | T;
    }

    rest(start = 1): Sequence<T> {
        const seq = this;
        return new Sequence(function* (): Generator<T, void, undefined> {
            let i = start;
            for (const x of seq) {
                if (i === 0) {
                    yield x;
                } else {
                    i--;
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
        return Sequence.of([])
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

    fold(fn: (acc: any, x: T) => any) {
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
                if (i > start) {
                    yield x;
                }
            }
        });
    }

    takeNth(n: number): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            let i = 1;
            for (const x of seq) {
                if (i === 1) {
                    i = n;
                    yield x;
                } else i--;
            }
        })
    }

    butLast(): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            let first = true;
            let prev = undefined;
            for (const x of seq) {
                if (!first) {
                    yield prev!;
                    prev = x;
                } else {
                    prev = x;
                    first = false;
                }
            }
        })
    }

    splitAt(n: number): Sequence<Sequence<T>> {
        return Sequence.ofItems(this.take(n), this.drop(n));
    }

    splitWith(fn: (x: T) => boolean): Sequence<Sequence<T>> {
        return Sequence.ofItems(this.takeWhile(fn), this.dropWhile(fn));
    }

    flatten(flattenStr: boolean = false): Sequence<any> {
        const seq = this;
        return new Sequence(function* () {
            for (const x of seq) {
                let stack: any[] = [x];
                while (stack.length > 0) {
                    let curr = stack.pop();
                    if (isIterable(curr, flattenStr)) {
                        const gen = isIterator(curr) ? curr : curr[Symbol.iterator]();
                        const {done, value} = gen.next();
                        if (!done) {
                            stack.push(gen);
                            stack.push(value);
                        }
                    } else {
                        yield curr;
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

    dedupe(): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            let prev = "there's absolutely no way in heck you'll have a stream that equals this in your sequence" as unknown as T;
            for (const x of seq) {
                if (prev !== x) {
                    yield x;
                    prev = x;
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
            for (const x of seq) {
                yield x
            }
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
            let value;
            let gen = seq.toGenerator();
            while (true) {
                ({done, value} = gen.next());
                if (done) {
                    gen = seq.toGenerator();
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
            let gen1 = seq.toGenerator();
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
            let gen = seq.toGenerator();
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

    groupBy<R>(fn: (x: T) => R): Map<R, Sequence<T>> {
        const map = new Map<R, Sequence<T>>();
        for (const x of this) {
            const y = fn(x);
            if (map.has(y)) {
                const group = map.get(y);
                map.set(y, group.append(x))
            } else {
                map.set(y, Sequence.of(x))
            }
        }
        return map;
    }

    partition(fn: (x: T) => boolean): Sequence<Sequence<T>> {
        return Sequence.ofItems(this.filter(fn), this.remove(fn))
    }

    partitionBy(fn: (x: T) => any): Sequence<Sequence<T>> {
        const seq: Sequence<T> = this;
        return new Sequence(function* () {
            let newSeq = seq;
            while (!newSeq.isEmpty()) {
                let res = fn(newSeq.first());
                let group = newSeq.takeWhile(x => fn(x) === res);
                yield(group);
                newSeq = seq.dropWhile(x => fn(x) === res);
            }
        })
    }

    /**
     *  Removes falsey values, like 0, null, undefined, and false
     *
     *  @param voidOnly - if true, only removes "void" (null || undefined)
     *  @returns A list with only the 'truthy' items remaining
     */
    compact(voidOnly = false): Sequence<T> {
        if (voidOnly) {
            return this.filter(x => x !== undefined && x !== null)
        } else {
            return this.filter(x => !!x)
        }
    }

    toArray(): T[] {
        return [...this]
    }

    toMap<K, V>(): Map<K, V> {
        const first = this.first();
        if (first instanceof Sequence && first.length() === 2) {
            const mappableSeq = this.map((x: any) => x.toArray());
            return new Map<K, V>(mappableSeq)
        } else if (Array.isArray(first) && first.length === 2) {
            return new Map<K, V>(this as any);
        } else if (this.length() === 0) {
            return new Map<K, V>();
        } else {
            return this.chunk(2).toMap<K, V>();
        }
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

    toString(): string {
        let res = "";
        for (const c of this) {
            res += c;
        }
        return res;
    }

    toGenerator(): Generator<T, void, undefined> {
        return this[Symbol.iterator]();
    }

    isEmpty(): boolean {
        const gen = this.toGenerator();
        const {done} = gen.next();
        return done;
    }

    length(): number {
        let count = 0;
        for (const x of this) {
            count++;
        }
        return count;
    }
}

