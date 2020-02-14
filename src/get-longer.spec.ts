import {Sequence} from "./index";

describe("Methods that make the sequence longer:", () => {
    describe("append", () => {
        it("should add an item to the end of a sequence", () => {
            const seq = Sequence.of([1, 2, 3]).append(4);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4]);
        });

        it("should add an item to the end of an empty sequence", () => {
            const seq = Sequence.of([]).append(1);
            expect(seq.toArray()).toMatchObject([1]);
        });

        it("should be able to be consumed repeatedly", () => {
            const seq = Sequence.of([]).append(1);
            expect(seq.toArray()).toMatchObject([1]);
            expect(seq.toArray()).toMatchObject([1]);
        })
    });

    describe("prepend", () => {
        it("should add an item to the start of a sequence", () => {
            const seq = Sequence.of([2, 3, 4]).prepend(1);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4]);
        });

        it("should add an item to the start of an empty sequence", () => {
            const seq = Sequence.of([]).prepend(1);
            expect(seq.toArray()).toMatchObject([1]);
        });

        it("should be able to be consumed repeatedly", () => {
            const seq = Sequence.of([]).prepend(1);
            expect(seq.toArray()).toMatchObject([1]);
            expect(seq.toArray()).toMatchObject([1]);
        })
    });

    describe("concat", () => {
        it("should concatenate an iterable to the end of a sequence", () => {
            const seq = Sequence.of([1, 2, 3]).concat([4, 5, 6]);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5, 6]);
        });

        it("should concatenate an iterable to the end of a sequence, even if it's empty", () => {
            const seq = Sequence.of([]).concat([1, 2, 3]);
            expect(seq.toArray()).toMatchObject([1, 2, 3]);
        });

        it("should handle appending an empty iterable", () => {
            const seq = Sequence.of([1, 2, 3]).concat([]);
            expect(seq.toArray()).toMatchObject([1, 2, 3]);
        });

        it("should be able to be consumed repeatedly", () => {
            const seq = Sequence.of([1, 2, 3]).concat([4, 5, 6]);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5, 6]);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5, 6]);
        })
    });

    describe("mapcat", () => {
        it("should map items into an iterable and then concatenate those items", () => {
            const seq = Sequence.of([1, 2, 3]).mapcat(x => [x * 2, x * 3]);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 6, 6, 9]);
        });

        it("should be able to be consumed repeatedly", () => {
            const seq = Sequence.of([1, 2, 3]).mapcat(x => [x * 2, x * 3]);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 6, 6, 9]);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 6, 6, 9]);
        })
    });

    describe("cycle", () => {
        it("should repeat forever", () => {
            const seq = Sequence.of([1, 2, 3]).cycle().take(9);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 1, 2, 3, 1, 2, 3]);
        });

        it("should be able to be consumed repeatedly", () => {
            const seq = Sequence.of([1, 2, 3]).cycle().take(9);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 1, 2, 3, 1, 2, 3]);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 1, 2, 3, 1, 2, 3]);
        })
    });

    describe("interleave", () => {
        it("should interleave the elements of an Iterable into the sequence", () => {
            const seq = Sequence.of([1, 3, 5]).interleave([2, 4]);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5])
        });

        it("should be repeatedly consumable", () => {
            const seq = Sequence.of([1, 3, 5]).interleave([2, 4]);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5]);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5]);
        })
    });


    describe("interpose", () => {
        it("should interpose an item between every element of sequence", () => {
            const seq = Sequence.of([1, 1, 1]).interpose(2);
            expect(seq.toArray()).toMatchObject([1, 2, 1, 2, 1]);
        });

        it("should be repeatedly consumable", () => {
            const seq = Sequence.of([1, 1, 1]).interpose(2);
            expect(seq.toArray()).toMatchObject([1, 2, 1, 2, 1]);
            expect(seq.toArray()).toMatchObject([1, 2, 1, 2, 1]);
        });
    });
});