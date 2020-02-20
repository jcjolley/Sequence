import {Sequence} from "./index";
import {Sequence2} from "./sequence2";

describe('Sequence Creation: ', () => {
    describe('Sequence.of', () => {

        it('should create a Sequence from an Array', () => {
            const arr = [1, 2, 3, 4, 5];
            const seq = Sequence.of(arr);
            expect(seq).toBeInstanceOf(Sequence);
            expect(seq.toArray()).toMatchObject(arr);
        });

        it('should create a Sequence from a String', () => {
            const str = 'A test string';
            const seq = Sequence.of(str);
            expect(seq).toBeInstanceOf(Sequence);
            expect(seq.toString()).toEqual(str);
        });

        it('should create a Sequence from a Map', () => {
            const map = new Map();
            map.set("A test", true);
            const seq = Sequence.of(map);
            expect(seq).toBeInstanceOf(Sequence);
            expect(seq.toMap()).toMatchObject(map);
        });

        it('should create a Sequence from a Set', () => {
            const set = new Set();
            set.add("A test");
            const seq = Sequence.of(set);
            expect(seq).toBeInstanceOf(Sequence);
            expect(seq.toSet()).toMatchObject(set)
        });

        it('should create a Sequence from multiple arguments', () => {
            const seq = Sequence.ofItems(1, 2, 3, 4, 5);
            expect(seq).toBeInstanceOf(Sequence);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5])
        });
    });

    describe('fromObj', () => {
        it('should create a Sequence from an Object', () => {
            const obj = {a: 1, b: 2, c: 3};
            const seq = Sequence.fromObj(obj);
            expect(seq).toBeInstanceOf(Sequence);
        });
    });

    describe('range', () => {
        it('should create a range of numbers', () => {
            const seq = Sequence.range().take(5);
            expect(seq).toBeInstanceOf(Sequence);
            expect(seq.toArray()).toMatchObject([0, 1, 2, 3, 4])
        });

        it('should stop when you tell it to', () => {
            const seq = Sequence.range(0, 5);
            expect(seq).toBeInstanceOf(Sequence);
            expect(seq.toArray()).toMatchObject([0, 1, 2, 3, 4])
        });

        it('should start where you tell it to', () => {
            const seq = Sequence.range(5, 10);
            expect(seq).toBeInstanceOf(Sequence);
            expect(seq.toArray()).toMatchObject([5, 6, 7, 8, 9])
        });

        it('should step like you tell it to', () => {
            const seq = Sequence.range(0, 10, 2);
            expect(seq).toBeInstanceOf(Sequence);
            expect(seq.toArray()).toMatchObject([0, 2, 4, 6, 8])
        })
    });

    describe('repeat', () => {
        it('should repeat a value forever', () => {
            const seq = Sequence.repeat(1).take(5);
            expect(seq).toBeInstanceOf(Sequence);
            expect(seq.toArray()).toMatchObject([1, 1, 1, 1, 1])
        });

        it('should stop when you tell it to', () => {
            const seq = Sequence.repeat(1, 5);
            expect(seq).toBeInstanceOf(Sequence);
            expect(seq.toArray()).toMatchObject([1, 1, 1, 1, 1])
        });
    });

    describe("iterate", () => {
        it("should iterate on a function", () => {
            const seq = Sequence.iterate((n) => n + 1, 5).take(5);
            expect(seq).toBeInstanceOf(Sequence);
            expect(seq.toArray()).toMatchObject([6, 7, 8, 9, 10])

        })
    });

    describe("asdf", () => {
        it("should be repeatable", () => {
            const arr = [1, 2, 3];
            const seq = Sequence2.of(arr);
            const res1 = seq.map(x => x + 1);
            const res2 = seq.map(x => x + 1);
            console.log("Res1: ", [...res1]);
            console.log("Res2: ", [...res2]);
            expect([...res1]).toMatchObject([2, 3, 4]);
            expect([...res2]).toMatchObject([2, 3, 4]);
        })
    })
});
