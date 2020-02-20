const {test: longerFilterMapReduce} = require('./longer-filter-map-reduce');
const {test: simpleFilterMapReduce} = require('./simple-filter-map-reduce');

const tests = [simpleFilterMapReduce, longerFilterMapReduce];

tests.forEach(fn => {
    fn();
});
