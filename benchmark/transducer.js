export const makeFilterTransducer = pred => nextReducer => (acc, x) => pred(x) ? nextReducer(acc, x) : acc;
export const makeMapTransducer = fn => nextReducer => (acc, x) => nextReducer(acc, fn(x));
const toIndex = (x, i) => x * i;
const isEven = x => x % 2 === 0;
const square = x => x * x;
const toIndexTransducer = makeMapTransducer(toIndex);
const isEvenTransducer = makeFilterTransducer(isEven);
const squareTransducer = makeMapTransducer(square);
export const collector = (acc, x) => {
    acc.push(x);
    return acc;
};
const allInOneTransducer = squareTransducer(isEvenTransducer(toIndexTransducer(collector)));
//# sourceMappingURL=transducer.js.map