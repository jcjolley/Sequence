import {Sequence} from "../src";

describe('Sequence Creation: ', () => {
    describe('Sequence.of', () => {

        it('should create a Sequence from an Array', () => {
            const arr = [1, 2, 3, 4, 5];
            const seq = Sequence.of(arr);
            expect(seq).toBeInstanceOf(Sequence);
        });

        it('should create a Sequence from a String', () => {
            const str = 'A test string';
            const seq = Sequence.of(str);
            expect(seq).toBeInstanceOf(Sequence);
        });

        it('should create a Sequence from a Map', () => {
            const map = new Map();
            map.set("A test", true);
            const seq = Sequence.of(map);
            expect(seq).toBeInstanceOf(Sequence);
        });

        it('should create a Sequence from a Set', () => {
            const set = new Set();
            set.add("A test");
            const seq = Sequence.of(set);
            expect(seq).toBeInstanceOf(Sequence);
        });
    });

    describe('fromObj', () => {
        it('should create a Sequence from an Object', () => {
            const obj = {a: 1, b: 2, c: 3};
            const seq = Sequence.fromObj(obj);
            expect(seq).toBeInstanceOf(Sequence);
        });
    });
});
