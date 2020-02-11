export const isIterable = <T>(x: any, flattenStr: boolean = false): x is Iterable<T>  => {
    return (
        x !== null &&
        x !== undefined &&
        typeof x[Symbol.iterator] === "function" &&
        (flattenStr
            ? typeof x === "string"
                ? x.length > 1
                : true
            : typeof x !== "string")
    );
};
