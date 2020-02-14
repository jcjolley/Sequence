import {Sequence} from "./index";

describe("Transform a sequence", () => {
    describe("map", () => {
        it('should apply the provided function to each element of the sequence', () => {
            const seq = Sequence.of([1, 2, 3]).map(x => x * 2);
            expect(seq.toArray()).toMatchObject([2, 4, 6]);
        });

        it('should be repeatedly consumable', () => {
            const seq = Sequence.of([1, 2, 3]).map(x => x * 2);
            expect(seq.toArray()).toMatchObject([2, 4, 6]);
            expect(seq.toArray()).toMatchObject([2, 4, 6]);
        });
    });

    describe("flatten", () => {
        it('should flatten nested iterables', () => {
            const seq = Sequence.of([1, [2, 3], [[4], [5, 6]]]).flatten();
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5, 6]);
        });

        it('should handle iterables containing strings without mangling strings', () => {
            const seq = Sequence.of(["One", ["Two", "Three"], [["Four"], ["Five", "Six"]]]).flatten();
            expect(seq.toArray()).toMatchObject(["One", "Two", "Three", "Four", "Five", "Six"]);
        });

        it('should allow for strings to be consumed if flagged for it', () => {
            const seq = Sequence.of(["One", ["Two", "Three"], [["Four"], ["Five", "Six"]]]).flatten(true);
            expect(seq.toString()).toEqual("OneTwoThreeFourFiveSix");
        });

        it('should be repeatedly consumable', () => {
            const seq = Sequence.of([1, [2, 3], [[4], [5, 6]]]).flatten();
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5, 6]);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5, 6]);
        });
    });
});