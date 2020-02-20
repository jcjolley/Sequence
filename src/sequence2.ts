export class Sequence2<T> {
    map: any;
    filter: any;
    reduce: any;

    constructor(genFn: () => Generator<T, void, undefined>) {
        this[Symbol.iterator] = genFn;
    }

    static of<T>(xs: Iterable<T>) {
        return new Sequence2(function* () {
            for (const x of xs) {
                yield x;
            }
        })
    }

    /**
     * Create a range of numbers
     * E.g., Sequence.range() yields S[0, 1, 2, 3, ...]
     *   and Sequence.range(0, 10, 2) yields S[0, 2, 4, 6, 8]
     * @param start - defaults to 0
     * @param end - defaults to infinity
     * @param step - defaults to 1
     */
    static range(start = 0, end = Infinity, step = 1): Sequence2<number> {
        return new Sequence2(function* () {
            let n = start;
            while (n < end) {
                yield n;
                n += step;
            }
        })
    }

    * [Symbol.iterator](): Generator<T, void, undefined> {
    }

}

const map = <T, R>(fn: (x: T) => R, items: Iterable<T>): Sequence2<R> => {
    return new Sequence2(function* () {
        for (const item of items) {
            yield fn(item);
        }
    })
};

const filter = <T>(pred: (x: T) => boolean, items: Iterable<T>): Sequence2<T> => {
    return new Sequence2(function* () {
        for (const item of items) {
            if (pred(item)) {
                yield item;
            }
        }
    })
};

const reduce = <T, R>(reducer: (acc: R, item: T) => R, items: Iterable<T>, initial?: R): R => {
    const gen = items[Symbol.iterator]();
    let value, done;
    if (initial === undefined) {
        ({value, done} = gen.next());
        if (!done) {
            initial = value;
        }
    }
    let acc;
    ({value, done} = gen.next());
    while (!done) {
        acc = reducer(initial, value);
        ({value, done} = gen.next());
    }
    return acc;
};

Sequence2.prototype.map = function <T, R>(fn: (x: T) => R): Sequence2<R> {
    return map(fn, this);
};

Sequence2.prototype.filter = function <T>(pred: (x: T) => boolean): Sequence2<T> {
    return filter(pred, this);
};

Sequence2.prototype.reduce = function <T, R>(reducer: (acc: R, x: T) => R, initial?: R) {
    return reduce(reducer, this, initial);
};
