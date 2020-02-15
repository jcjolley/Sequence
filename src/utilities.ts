export const isIterable = <T>(x: any, flattenStr: boolean = false): x is Iterable<T> => {
    return x !== null
        && x !== undefined
        && typeof x[Symbol.iterator] === "function"
        && (flattenStr
            ? typeof x === "string"
                ? x.length > 1
                : true
            : typeof x !== "string")
};

export const isIterator = <T>(x: any): x is Iterator<T, void, undefined> =>
    x !== null && x !== undefined && typeof x.next === 'function';

