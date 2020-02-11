import { printHtml } from "./printHtml";
import { makeMapTransducer, makeFilterTransducer, collector } from "./transducer";
import { Sequence } from "./sequence";
import { range } from "lodash/fp";
import { round } from "lodash";
// SETUP
const size = 10000;
const testArr = range(0, size);
// SEQUENCE TEST
const sequenceT1 = performance.now();
const sequenceResults = Sequence.of(testArr)
    .map(x => x + 1)
    .filter(x => x % 2 === 0)
    .map(x => x * x)
    .filter(x => x % 3 === 0);
const sequenceT2 = performance.now();
// ARRAY TEST
const arrayT1 = performance.now();
const arrayResults = testArr
    .map(x => x + 1)
    .filter(x => x % 2 === 0)
    .map(x => x * x)
    .filter(x => x % 3 === 0);
const arrayT2 = performance.now();
// TRANSDUCER SETUP
const transducer = makeMapTransducer(x => x + 1)(makeFilterTransducer(x => x % 2 === 0)(makeMapTransducer(x => x * x)(makeFilterTransducer(x => x % 3 === 0)(collector))));
// TRANSDUCER TEST
const transducerT1 = performance.now();
const transducerResults = testArr.reduce(transducer, []);
const transducerT2 = performance.now();
const results = Object.fromEntries(Object.entries({
    sequenceTime: round(sequenceT2 - sequenceT1, 4),
    sequenceResults: sequenceResults.reduce((acc, x) => acc + x),
    transducerTime: round(transducerT2 - transducerT1, 4),
    transducerResults: transducerResults.reduce((acc, x) => acc + x),
    arrayTime: round(arrayT2 - arrayT1, 4),
    arrayResults: arrayResults.reduce((acc, x) => acc + x)
}).sort(([, a], [, b]) => a - b));
// printHtml({ size, ...results });
printHtml([...Sequence.of([1, 2, 3, "bob"]).flatten()]);
console.log([...sequenceResults].reduce((acc, x) => acc + x));
console.log([...sequenceResults].reduce((acc, x) => acc + x));
console.log([...sequenceResults].reduce((acc, x) => acc + x));
//# sourceMappingURL=benchmarks.js.map