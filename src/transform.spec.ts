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

    describe("mapIndexed", () => {
        it('should apply the provided function to each element of the sequence with the index', () => {
            const seq = Sequence.of([1, 2, 3]).mapIndexed((x, i) => x + i);
            expect(seq.toArray()).toMatchObject([1, 3, 5]);
        });

        it('should be repeatedly consumable', () => {
            const seq = Sequence.of([1, 2, 3]).mapIndexed((x, i) => x + i);
            expect(seq.toArray()).toMatchObject([1, 3, 5]);
            expect(seq.toArray()).toMatchObject([1, 3, 5]);
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

    describe("chunk", () => {
        it("should partition a sequence into groups with the provided size and step", () => {
            const chunked = Sequence.range().chunk(2).take(3).map(x => x.toArray());
            expect(chunked.toArray()).toMatchObject([[0, 1], [2, 3], [4, 5]])
        });

        it("should be repeatable", () => {
            const chunked = Sequence.range().chunk(2).take(3).map(x => x.toArray());
            expect(chunked.toArray()).toMatchObject([[0, 1], [2, 3], [4, 5]]);
            expect(chunked.toArray()).toMatchObject([[0, 1], [2, 3], [4, 5]])
        });

        it("should return a hanging partial chunk if there is one", () => {
            const chunked = Sequence.range().take(7).chunk(3).map(x => x.toArray());
            expect(chunked.toArray()).toMatchObject([[0, 1, 2], [3, 4, 5], [6]])
        });

        it("shouldn't omit a hanging chunk if there isn't one", () => {
            const chunked = Sequence.range().take(6).chunk(3).map(x => x.toArray());
            expect(chunked.toArray()).toMatchObject([[0, 1, 2], [3, 4, 5]])
        })

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

    describe("splitWith", () => {
        it("should divide a sequence when fn returns false", () => {
            const seq = Sequence.ofItems(1, 2, 3, 4, 5, 6).splitWith(x => x < 4);
            expect(seq.first().toArray()).toMatchObject([1, 2, 3]);
            expect(seq.second().toArray()).toMatchObject([4, 5, 6]);
        });

        it("should be repeatably consumable", () => {
            const seq = Sequence.ofItems(1, 2, 3, 4, 5, 6).splitWith(x => x < 4);
            expect(seq.first().toArray()).toMatchObject([1, 2, 3]);
            expect(seq.second().toArray()).toMatchObject([4, 5, 6]);

            expect(seq.first().toArray()).toMatchObject([1, 2, 3]);
            expect(seq.second().toArray()).toMatchObject([4, 5, 6]);
        });
    });

    describe("replace", () => {
        it("should replace any items found as keys in the map with their corresponding values", () => {
            const letters = Sequence.range().map(x => String.fromCharCode(x + 65)).take(3);

            const replacements = Sequence.range().interleave(letters).toMap<number, string>();
            const seq = Sequence.range().replace(replacements).take(5);
            expect(seq.toArray()).toMatchObject(["A", "B", "C", 3, 4])
        });

        it("should be repeatedly consumable", () => {
            const letters = Sequence.range().map(x => String.fromCharCode(x + 65)).take(3);
            const replacements = Sequence.range().interleave(letters).toMap<number, string>();
            const seq = Sequence.range().replace(replacements).take(5);

            expect(seq.toArray()).toMatchObject(["A", "B", "C", 3, 4]);
            expect(seq.toArray()).toMatchObject(["A", "B", "C", 3, 4])
        })
    });

    describe("splice", () => {
        it("should delete items", () => {
            const seq = Sequence.range().take(12).splice(2, 5);
            const expected = Sequence.range().take(12).toArray();
            expected.splice(2, 5);
            console.log("seq", seq.toArray());
            console.log("expected", expected);
            expect(seq.toArray()).toMatchObject(expected);
        });

        it("should add items", () => {
            const seq = Sequence.range().take(10).splice(2, 3, [-1, -1, -1]);
            const expected = Sequence.range().take(10).toArray();
            expected.splice(2, 3, -1, -1, -1);
            expect(seq.toArray()).toMatchObject(expected);
        });

        it("should drop if only provided one argument", () => {
            const seq = Sequence.range().take(10).splice(2);
            const expected = Sequence.range().take(10).toArray();
            expected.splice(2);
            expect(seq.toArray()).toMatchObject(expected);
        });

        it("should handle negative starts", () => {
            const seq = Sequence.range().take(10).splice(-3);
            const expected = Sequence.range().take(10).toArray();
            expected.splice(-3);
            expect(seq.toArray()).toMatchObject(expected);
        });

        it("should delete from negative starts", () => {
            const seq = Sequence.range().take(10).splice(-5, 3);
            const expected = Sequence.range().take(10).toArray();
            expected.splice(-5, 3);
            expect(seq.toArray()).toMatchObject(expected);
        });

        it("should delete and insert from negative starts", () => {
            const seq = Sequence.range().take(10).splice(-5, 3, [1, 2]);
            const expected = Sequence.range().take(10).toArray();
            expected.splice(-5, 3, 1, 2);
            expect(seq.toArray()).toMatchObject(expected);
        });


        it('should be repeatedly consumable', () => {
            const seq = Sequence.range().slice(2, 7);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 5, 6]);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 5, 6]);
        });
    });
});
