const Suite = require("../node_modules/benchmark/benchmark").Suite;
const Sequence = require("../dist/index.js").Sequence;
const Sequence2 = require("../dist/sequence2.js").Sequence2;
const L = require("list/methods");
const _ = require("lodash/fp");

const test = () => {

    const results = [];

    [10, 100, 1000, 10000, 100000, 1000000].forEach(size => {
        const suite = new Suite;
        suite.add("Array", () => {
            const range = [...Array(size).keys()];
            range
                .filter(x => x % 5 === 0)
                .map(x => x * 2)
                .reduce((acc, x) => acc + x);
        })
            .add("Sequence", () => {
                Sequence.range(0, size)
                    .filter(x => x % 5 === 0)
                    .map(x => x * 2)
                    .reduce((acc, x) => acc + x)
            })
            .add("Sequence2", () => {
                Sequence2.range(0, size)
                    .filter(x => x % 5 === 0)
                    .map(x => x * 2)
                    .reduce((acc, x) => acc + x)
            })
            .add("List", () => {
                L.range(0, size)
                    .filter(x => x % 5 === 0)
                    .map(x => x * 2)
                    .reduce((acc, x) => acc + x, 0)
            })
            .add("Lodash", () => {
                _.pipe(
                    _.filter(x => x % 5 === 0),
                    _.map(x => x * 2),
                    _.reduce((acc, x) => acc + x, 0)
                )(_.range(0, size))
            })
            .on('cycle', (event) => console.log(`Size: ${size}`, String(event.target)))
            .on('complete', function () {
                console.log("Fastest: ", this.filter('fastest').map('name'));
                results.push(this.map('stats.mean'))
            })
            .run()
    });

    return results;
};

module.exports = {test};
