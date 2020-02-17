import {isIterable, isIterator} from "./utilities";

/** @class Sequence representing a lazy list of values. */
export class Sequence<T> {
    * [Symbol.iterator](): Generator<T, void, undefined> {
    }

    /**
     * Creates a sequence from an argument-less generator function
     * @param {() => Generator<T, void, undefined>} generatorFn
     */
    constructor(generatorFn: () => Generator<T, void, undefined>) {
        if (typeof generatorFn === "function") {
            this[Symbol.iterator] = generatorFn;
        } else {
            throw new Error("Cannot create Sequence from provided argument");
        }
    }

    /**
     * Creates a Sequence from an Iterable or a single object
     * @param {Iterable<T> | T} obj
     * @returns {Sequence<T>}
     */
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

    /**
     * Creates a sequence from the provided arguments
     * @param {T} items
     * @returns {Sequence<T>}
     */
    static ofItems<T>(...items: Array<T>): Sequence<T> {
        if (arguments.length === 1) {
            return Sequence.of(items[0])
        } else {
            return Sequence.of(items);
        }
    }

    /**
     * Creates a sequence from the entries of an object.
     * E.g., Sequence.fromObj({a: 1, b: 2}) is the same as Sequence.of([["a", 1], ["b", 2]])
     * @param obj
     * @returns {Sequence<[string, unknown]>}
     */
    static fromObj(obj: any): Sequence<[string, unknown]> {
        const entries = Object.entries(obj);
        return new Sequence(function* (): Generator<[string, unknown], void, undefined> {
            for (const [key, value] of entries) {
                yield [key, value]
            }
        });
    }

    /**
     * Create a range of numbers
     * E.g., Sequence.range() yields S[0, 1, 2, 3, ...]
     *   and Sequence.range(0, 10, 2) yields S[0, 2, 4, 6, 8]
     * @param {number} start - defaults to 0
     * @param {number} end - defaults to infinity
     * @param {number} step - defaults to 1
     * @returns {Sequence<number>}
     */
    static range(start = 0, end = Infinity, step = 1): Sequence<number> {
        return new Sequence(function* () {
            let n = start;
            while (n < end) {
                yield n;
                n += step;
            }
        })
    }

    /**
     * Create a Sequence that repeats x a given number of times (defaults to infinity)
     * @param {T} x
     * @param {number} times
     * @returns {Sequence<T>}
     */
    static repeat<T>(x: T, times = Infinity): Sequence<T> {
        return new Sequence(function* () {
            let i = 0;
            while (i < times) {
                yield x;
                i++;
            }
        })
    }

    /**
     * Creates a sequence from iterating a function on the initial argument and subsequent results.
     * E.g., Sequence.iterate(x => x + 1, 5) yields S[6, 7, 8, 9, 10, ...]
     * @param fn
     * @param arg
     * @returns {Sequence<any>}
     */
    static iterate(fn: any, arg) {
        return new Sequence(function* () {
            let res = arg;
            while (true) {
                res = fn(res);
                yield res;
            }
        })
    }

    /**
     * Creates a new sequence by apply the provided function to each element of a sequence
     * E.g., Sequence.ofItems(1,2,3).map(x => x + 1) yields S[2,3,4]
     * @param {(x: T) => R} fn
     * @returns {Sequence<R>}
     */
    map<R>(fn: (x: T) => R): Sequence<R> {
        const seq = this;
        return new Sequence<R>(function* (): Generator<R, void, undefined> {
            for (const x of seq) {
                yield fn(x);
            }
        });
    }

    /**
     * Creates a new sequence by apply the provided function to each element of a sequence
     * E.g., Sequence.ofItems(0,1,2).mapIndexed((x, i) => x + i) yields S[0, 2, 4]
     * @param {(x: T, index: number) => R} fn
     * @returns {Sequence<R>}
     */
    mapIndexed<R>(fn: (x: T, index: number) => R): Sequence<R> {
        const seq = this;
        return new Sequence<R>(function* (): Generator<R, void, undefined> {
            let i = 0;
            for (const x of seq) {
                yield fn(x, i);
                i++;
            }
        })
    }

    /**
     * Calls the provided function for each item in the sequence, presumably for side effects
     * E.g., Sequence.ofItems(0,1,2).forEach(x => console.log(x)) will log each item in the sequence
     * @param {(x: T, index: number) => R} fn
     * @returns {Sequence<R>}
     */
    forEach(fn: (x: T) => any): void {
        for (const x of this) {
            fn(x);
        }
    }

    /**
     * Creates a sequence where each item in the sequence found as a key in the provided map is replaced by the
     * value for that key in the map.
     * E.g., Sequence.ofItems(1,2,3).replace(new Map([[1, "a"]]) yields S["a", 2, 3]
     * @param {Map<T, R>} replacements
     * @returns {Sequence<T | R>}
     */
    replace<R>(replacements: Map<T, R>): Sequence<T | R> {
        const seq = this;
        return new Sequence(function* () {
            for (const x of seq) {
                yield replacements.has(x) ? replacements.get(x) : x
            }
        })
    }

    /**
     * Creates a sequence of elements split into groups the length of size (or smaller for the final group if
     * the sequence can't be split evenly.)
     * E.g., Sequence.range().take(7).chunk(3) yields S[S[0,1,2], S[3,4,5], S[6]]
     * @param {number} size
     * @param {number} step
     * @returns {Sequence<Sequence<T>>}
     */
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
            if (group.length > 0) {
                yield Sequence.of(group);
            }
        })
    }

    /**
     * Returns the first item of a sequence, if it exists
     * @returns {undefined | T}
     */
    first(): undefined | T {
        let gen = this.toGenerator();
        const {value} = gen.next();
        return value as undefined | T
    }

    /**
     * Returns the second item of a sequence, if it exists
     * @returns {undefined | T}
     */
    second(): undefined | T {
        return this.nth(1)
    }

    /**
     * Returns the nth item of a sequence, if it exists
     * @param {number} n
     * @returns {undefined | T}
     */
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

    /**
     * Creates a sequence from the current sequence, starting at `start`
     * E.g., Sequence.range().rest() yields S[1,2,3...]
     *   and Sequence.range().rest(3) yields S[3,4,5...]
     * @param {number} start
     * @returns {Sequence<T>}
     */
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

    /**
     * Alias for rest, Creates a sequence by dropping `n` elements from the current sequence
     * E.g., Sequence.range().drop(1) yields S[1,2,3...]
     *   and Sequence.range().drop(3) yields S[3,4,5...]
     * @param {number} n
     * @returns {Sequence<T>}
     */
    drop(n: number): Sequence<T> {
        return this.rest(n);
    }

    /**
     * Creates a sequence by dropping elements while pred returns true
     * E.g., Sequence.range().dropWhile(x => x < 5) yields S[5,6,7,...]
     * @param {(x: T) => boolean} pred
     * @returns {Sequence<T>}
     */
    dropWhile(pred: (x: T) => boolean): Sequence<T> {
        const seq = this;
        let n = 0;
        for (const x of seq) {
            if (pred(x)) n++;
            else return this.rest(n);
        }
        return Sequence.of([])
    }

    /**
     * Reduces a sequence into a single value using the provided function
     * E.g., Sequence.range().take(4).reduce((sum, x) => sum + x, 0) yields 6
     * @param {(acc: any, x: T) => any} fn
     * @param initial
     * @returns {any}
     */
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

    /**
     * Reduces a sequence into a single value using the provided function.  This is the same as @link{Sequence.reduce}
     * but uses the first item of the sequence as the initial value
     * E.g., Sequence.range().take(4).fold((sum, x) => sum + x) yields 6
     * @param {(acc: any, x: T) => any} fn
     * @returns {T}
     */
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

    /**
     * Creates a sequence by taking `n` elements from the current sequence (or as many as there are to take up to n)
     * E.g., Sequence.range().take(5) yields S[0,1,2,3,4]
     *   and Sequence.ofItems(1,2,3).take(5) yields S[1,2,3]
     * @param {number} n
     * @returns {Sequence<T>}
     */
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

    /**
     * Creates a sequence by taking elements from the current sequence while `pred` returns true
     * E.g., Sequence.range().takeWhile(x => x < 5) yields S[0,1,2,3,4]
     * @param {(x: T) => boolean} pred
     * @returns {Sequence<T>}
     */
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

    /**
     * Creates a sequence by taking the last n elements of a sequence
     * CAUTION: This runs in linear time and will not return for infinite sequences
     * E.g., Sequence.range().take(10).takeLast(3) yields S[7,8,9]
     * @param {number} n
     * @returns {Sequence<T>}
     */
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

    /**
     * Creates a sequence of every n elements
     * E.g., Sequence.range().takeNth(3) yields S[0,3,6,9,...]
     * @param {number} n
     * @returns {Sequence<T>}
     */
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

    /**
     * Creates a sequence with every element of the current sequence but the last one.
     * E.g., Sequence.range().take(4).butLast() yields S[0,1,2]
     * @returns {Sequence<T>}
     */
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

    /**
     * Creates a sequence with two elements from the current sequence split at n
     * E.g., Sequence.range().splitAt(3) yields S[S[0,1,2], S[3,4,5,...]]
     * @param {number} n
     * @returns {Sequence<Sequence<T>>}
     */
    splitAt(n: number): Sequence<Sequence<T>> {
        return Sequence.ofItems(this.take(n), this.drop(n));
    }

    /**
     * Creates a sequence with two elements from the current sequence split at the first time pred returns false
     * E.g., Sequence.range().splitWith(x < 3) yields S[S[0,1,2], S[3,4,5,...]]
     * @param {(x: T) => boolean} fn
     * @returns {Sequence<Sequence<T>>}
     */
    splitWith(fn: (x: T) => boolean): Sequence<Sequence<T>> {
        return Sequence.ofItems(this.takeWhile(fn), this.dropWhile(fn));
    }

    /**
     * Creates a sequence from the current sequence with each iterable in the sequence spread.
     * E.g., Sequence.of([1, [2, 3], [[4], [5, 6]]]).flatten() yields S[1, 2, 3, 4, 5, 6]
     *
     * Has special handling for strings.  By default, strings are not iterateed
     * E.g., Sequence.of(["One", ["Two", "Three"], [["Four"], ["Five", "Six"]]]).flatten()
     * yields S["One", "Two", "Three", "Four", "Five", "Six"]
     *
     * If string flattening is desired, set flattenStr to true
     * E.g., Sequence.of(["One", ["Two", "Three"], [["Four"], ["Five", "Six"]]]).flatten(true)
     * yields S["O","n","e","T","w","o","T","h","r","e","e","F","o","u","r","F","i","v","e","S","i","x"]
     * @param {boolean} flattenStr
     * @returns {Sequence<any>}
     */
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

    /**
     * Returns a sequence with no duplicates
     * E.g., Sequence.ofItems(1,1,2,2,3,3,1,1).distinct() yields S[1,2,3]
     *
     * CAUTION: This uses a set internally and could cause memory issues if a large number of elements are consumed
     * from the sequence.  If using on infinite sets, consider dedupe instead
     * @returns {Sequence<T>}
     */
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

    /**
     * Returns a sequence with no consecutive duplicates
     * E.g., Sequence.ofItems(1,1,2,2,3,3,1,1).dedupe() yields S[1,2,3,1]
     *
     * @returns {Sequence<T>}
     */
    dedupe(): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            let prev = NaN as unknown as T;
            for (const x of seq) {
                if (prev !== x) {
                    yield x;
                    prev = x;
                }
            }
        });
    }

    /**
     * Similar to filter, but remove creates a sequence with all items matching pred *removed* from the sequence
     * E.g., Sequence.range().remove(x => x % 2 === 0) yields S[1,3,5,...]
     * @param {(x: T) => boolean} pred
     * @returns {Sequence<T>}
     */
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

    /**
     * Prepends an item to the sequence
     * E.g., Sequence.range().prepend(-1) yields S[-1,0,1,2...]
     * @param {T} x
     * @returns {Sequence<T>}
     */
    prepend(x: T): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            yield x;
            for (const x of seq) yield x;
        });
    }

    /**
     * Appends an item to the sequence
     * E.g., Sequence.range(0,3).append(3) yields S[0,1,2,3]
     * @param {T} x
     * @returns {Sequence<T>}
     */
    append(x: T): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            for (const x of seq) {
                yield x
            }
            yield x;
        });
    }

    /**
     * Creates a sequence by concatenating the provided iterable to the end of the sequence
     * E.g., Sequence.ofItems(1,2,3).concat([4,5,6]) yields S[1,2,3,4,5,6]
     * @param {Iterable<T>} xs
     * @returns {Sequence<T>}
     */
    concat(xs: Iterable<T>): Sequence<T> {
        const seq = this;
        return new Sequence(function* () {
            for (const x of seq) yield x;
            for (const x of xs) yield x;
        });
    }

    /**
     * Creates a sequence by applying a fn that returns an iterable to each item in the sequence and
     * successively concatenating the results
     * E.g., Sequence.of([1, 2, 3]).mapcat(x => [x * 2, x * 3]) yields S[2, 3, 4, 6, 6, 9]
     * @param {(x: T) => Iterable<R>} fn
     * @returns {Sequence<R>}
     */
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

    /**
     * Turns a finite sequence into an infinite sequence by repeating the sequence once it's been consumed.
     * E.g., Sequence.ofItems(1,2).cycle() yields S[1,2,1,2,1,2...]
     * @returns {Sequence<T>}
     */
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

    /**
     * Interleaves the items of the provided iterable with the current sequence, terminating when either iterable terminates
     * E.g., Sequence.range().interleave(["a", "b", "c"]) yields S[0, "a", 1 "b", 2 "c"]
     * @param {Iterable<R>} xs
     * @returns {Sequence<T | R>}
     */
    interleave<R>(xs: Iterable<R>): Sequence<T | R> {
        const seq = this;
        return new Sequence(function* () {
            const gen1 = seq.toGenerator();
            const gen2 = xs[Symbol.iterator]();
            let done1, done2, value1, value2;
            while (!done1 && !done2) {
                ({done: done1, value: value1} = gen1.next());
                ({done: done2, value: value2} = gen2.next());
                if (done1 || done2) return;
                yield value1;
                yield value2;
            }
        });
    }

    /**
     * Interposes a single item between every item of the sequence
     * E.g., Sequence.range().interpose("a") yields S[0, "a", 1, "a", 2 ,"a",...]
     * @param {T} x
     * @returns {Sequence<T>}
     */
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

    /**
     * Groups the elements of a sequence into lists based on the result of the provided fn.
     * E.g., Sequence.range().take(6).groupBy(x => x % 2 === 0) yields new Map([true, S[0, 2, 4]] [false, S[1,3,5]])
     * @param {(x: T) => R} fn
     * @returns {Map<R, Sequence<T>>}
     */
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


    /**
     * Partitions the sequence into two groups based on result from pred
     * E.g., Sequence.range().partition(x => x % 2 === 0) yields S[S[0, 2, 4,...], S[1, 3, 5,...]]
     * @param {(x: T) => boolean} pred
     * @returns {Sequence<Sequence<T>>}
     */
    partition(pred: (x: T) => boolean): Sequence<Sequence<T>> {
        return Sequence.ofItems(this.filter(pred), this.remove(pred))
    }

    /**
     * Partitions the sequence with the provided function into a new seq each time
     * E.g., Sequence.ofItems(1, 1, 2, 2).cycle().partitionBy(x => x % 2 === 1)
     * yields S[S[1, 1], S[2, 2], S[1, 1], ...]
     * @param {(x: T) => any} fn
     * @returns {Sequence<Sequence<T>>}
     */
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

    /**
     * Creates an Array from the sequence
     * @returns {T[]}
     */
    toArray(): T[] {
        return [...this]
    }

    /**
     * Creates a Map from a sequence of key value pairs, or chunks the sequence by 2 and treats those as key value pairs
     * E.g., Sequence.of([["a", 1], ["b", 2]]).toMap() yields new Map([["a", 1], ["b", 2]])
     *   and Sequence.ofItems("a", 1, "b", 2").toMap() yields new Map([["a", 1], ["b", 2]])
     * @returns {Map<K, V>}
     */
    toMap<K, V>(): Map<K, V> {
        const first = this.first();
        if (first instanceof Sequence && first.length() === 2) {
            const mappableSeq = this.map((x: any) => x.toArray());
            return new Map<K, V>(mappableSeq)
        } else if (Array.isArray(first) && first.length === 2) {
            return new Map<K, V>(this as any);
        } else if (this.isEmpty()) {
            return new Map<K, V>();
        } else {
            return this.chunk(2).toMap<K, V>();
        }
    }

    /**
     * Creates a Set from the sequence
     * @returns {Set<T>}
     */
    toSet(): Set<T> {
        return new Set(this);
    }

    /**
     * Creates an object from the sequence
     * @returns {{[p: string]: any}}
     */
    toObject(): { [key: string]: any } {
        const first: T = this.first();
        if (first instanceof Sequence && first.length() === 2) {
            const obj = {};
            const mappableSeq = this.map((x: any) => x.toArray());
            for (const [key, value] of mappableSeq) {
                obj[key] = value;
            }
            return obj;
        } else if (Array.isArray(first) && first.length === 2) {
            const obj = {};
            for (const [key, value] of this as any) {
                obj[key] = value;
            }
            return obj;
        } else if (this.isEmpty()) {
            return {};
        } else {
            return this.chunk(2).toObject();
        }
    }

    /**
     * Creates a string from the sequence
     * @returns {string}
     */
    toString(): string {
        let res = "";
        for (const c of this) {
            res += c;
        }
        return res;
    }

    /**
     * Returns a generator for the seq
     * @returns {Generator<T, void, undefined>}
     */
    toGenerator(): Generator<T, void, undefined> {
        return this[Symbol.iterator]();
    }

    /**
     * Checks if the set is empty
     * @returns {boolean}
     */
    isEmpty(): boolean {
        const gen = this.toGenerator();
        const {done} = gen.next();
        return done;
    }

    /**
     * Determines the length of the sequence in linear time
     * CAUTION: Do not use on an infinite sequence.
     * @returns {number}
     */
    length(): number {
        let count = 0;
        for (const x of this) {
            count++;
        }
        return count;
    }
}

