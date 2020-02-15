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

    describe("partition", () => {
        it("should divide a sequence based on the provided function", () => {
            const seq = Sequence.ofItems(1, 2).cycle().partition(x => x % 2 === 1);
            expect(seq.first().take(5).toArray()).toMatchObject([1, 1, 1, 1, 1]);
            expect(seq.second().take(5).toArray()).toMatchObject([2, 2, 2, 2, 2]);
        });

        it("should be repeatably consumable", () => {
            const seq = Sequence.ofItems(1, 2).cycle().partition(x => x % 2 === 0);
            expect(seq.second().take(5).toArray()).toMatchObject([1, 1, 1, 1, 1]);
            expect(seq.first().take(5).toArray()).toMatchObject([2, 2, 2, 2, 2]);

            expect(seq.second().take(5).toArray()).toMatchObject([1, 1, 1, 1, 1]);
            expect(seq.first().take(5).toArray()).toMatchObject([2, 2, 2, 2, 2]);
        });
    });

    describe("partitionBy", () => {
        it("should divide a sequence based on the provided function", () => {
            const seq = Sequence.ofItems(1, 1, 2, 2).cycle().partitionBy(x => x % 2 === 1);
            expect(seq.first().toArray()).toMatchObject([1, 1]);
            expect(seq.second().toArray()).toMatchObject([2, 2]);
            expect(seq.nth(2).toArray()).toMatchObject([1, 1]);
        });

        it("should be repeatably consumable", () => {
            const seq = Sequence.ofItems(1, 1, 2, 2).cycle().partitionBy(x => x % 2 === 1);
            expect(seq.first().toArray()).toMatchObject([1, 1]);
            expect(seq.second().toArray()).toMatchObject([2, 2]);
            expect(seq.nth(2).toArray()).toMatchObject([1, 1]);

            expect(seq.first().toArray()).toMatchObject([1, 1]);
            expect(seq.second().toArray()).toMatchObject([2, 2]);
            expect(seq.nth(2).toArray()).toMatchObject([1, 1]);
        });
    });

    describe("splitAt", () => {
        it("should divide a sequence based at n", () => {
            const seq = Sequence.ofItems(1, 2, 3, 4, 5, 6).splitAt(3);
            expect(seq.first().toArray()).toMatchObject([1, 2, 3]);
            expect(seq.second().toArray()).toMatchObject([4, 5, 6]);
        });

        it("should be repeatably consumable", () => {
            const seq = Sequence.ofItems(1, 2, 3, 4, 5, 6).splitAt(3);
            expect(seq.first().toArray()).toMatchObject([1, 2, 3]);
            expect(seq.second().toArray()).toMatchObject([4, 5, 6]);

            expect(seq.first().toArray()).toMatchObject([1, 2, 3]);
            expect(seq.second().toArray()).toMatchObject([4, 5, 6]);
        });
    });
});