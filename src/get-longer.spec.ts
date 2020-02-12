import {Sequence} from "./index";

describe("Methods that make the sequence longer:", () => {
    describe("append", () => {
        it("should add an item to the end of a sequence", () => {
            const seq = Sequence.of([1, 2, 3]).append(4);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4]);
            expect(seq.toArray().length).toEqual(4)
        });

        it("should add an item to the end of an empty sequence", () => {
            const seq = Sequence.of([]).prepend(1);
            expect(seq.toArray()).toMatchObject([1]);
            expect(seq.toArray().length).toEqual(1)
        });
    });

    describe("prepend", () => {
        it("should add an item to the start of a sequence", () => {
            const seq = Sequence.of([2, 3, 4]).prepend(1);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4]);
            expect(seq.toArray().length).toEqual(4)
        });

        it("should add an item to the start of an empty sequence", () => {
            const seq = Sequence.of([]).prepend(1);
            expect(seq.toArray()).toMatchObject([1]);
            expect(seq.toArray().length).toEqual(1)
        });
    });

    describe("concat", () => {
        it("should concatenate an iterable to the end of a sequence", () => {
            const seq = Sequence.of([1, 2, 3]).concat([4, 5, 6]);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5, 6]);
            expect(seq.toArray().length).toEqual(6);
        });

        it("should concatenate an iterable to the end of a sequence, even if it's empty", () => {
            const seq = Sequence.of([]).concat([1, 2, 3]);
            expect(seq.toArray()).toMatchObject([1, 2, 3]);
            expect(seq.toArray().length).toEqual(3);
        });

        it("should handle appending an empty iterable", () => {
            const seq = Sequence.of([1,2,3]).concat([]);
            expect(seq.toArray()).toMatchObject([1, 2, 3]);
            expect(seq.toArray().length).toEqual(3);
        });
    });

    describe("mapcat", () => {
        it("should map items into an iterable and then concatenate those items", () => {
            const seq = Sequence.of([1, 2, 3]).mapcat(x => [x * 2, x * 3]);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 6, 6, 9]);
            expect(seq.toArray().length).toEqual(6);
        });
    });
});