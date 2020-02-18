const Suite = require("../node_modules/benchmark/benchmark").Suite;
const Sequence = require("../dist/index.js").Sequence;
const L = require("list/methods");
const _ = require("lodash/fp");

const results = [];

module.exports = {
    test: () => {
        [10, 100, 1000, 10000, 100000, 1000000].forEach(size => {
            const suite = new Suite;
            suite.add("Array", () => {
                const range = [...Array(size).keys()];
                range.filter(x => x % 3 === 0)
                    .map(x => x * 2)
                    .filter(x => x % 2 === 0)
                    .map(x => x + 1)
                    .map(x => x * x)
                    .filter(x => x % 2 === 1)
                    .reduce((acc, x) => acc + x);
            })
                .add("Sequence", () => {
                    Sequence.range(0, size)
                        .filter(x => x % 3 === 0)
                        .map(x => x * 2)
                        .filter(x => x % 2 === 0)
                        .map(x => x + 1)
                        .map(x => x * x)
                        .filter(x => x % 2 === 1)
                        .reduce((acc, x) => acc + x);
                })
                .add("List", () => {
                    L.range(0, size)
                        .filter(x => x % 3 === 0)
                        .map(x => x * 2)
                        .filter(x => x % 2 === 0)
                        .map(x => x + 1)
                        .map(x => x * x)
                        .filter(x => x % 2 === 1)
                        .reduce((acc, x) => acc + x);
                })
                .add("Lodash", () => {
                    _.pipe(
                        _.filter(x => x % 3 === 0),
                        _.map(x => x * 2),
                        _.filter(x => x % 2 === 0),
                        _.map(x => x + 1),
                        _.map(x => x * x),
                        _.filter(x => x % 2 === 1),
                        _.reduce((acc, x) => acc + x)
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
    }
};
