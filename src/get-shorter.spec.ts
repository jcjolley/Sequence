import {Sequence} from "./index";

describe("Methods that make a sequence shorter: ", () => {
    describe("rest", () => {
        it("should drop the first item from a sequence and return the rest", () => {
            const seq = Sequence.of([1, 2, 3]).rest();
            expect(seq.toArray()).toMatchObject([2, 3]);
        });

        it("should be repeatedly consumable", () => {
            const seq = Sequence.of([1, 2, 3]).rest();
            expect(seq.toArray()).toMatchObject([2, 3]);
            expect(seq.toArray()).toMatchObject([2, 3]);
        });
    });

    describe("drop", () => {
        it('should drop n elements from a sequence and return the rest', () => {
            const seq = Sequence.of([1, 2, 3, 4, 5]).drop(3);
            expect(seq.toArray()).toMatchObject([4, 5]);
        });

        it('should be repeatedly consumable', () => {
            const seq = Sequence.of([1, 2, 3, 4, 5]).drop(3);
            expect(seq.toArray()).toMatchObject([4, 5]);
            expect(seq.toArray()).toMatchObject([4, 5]);
        });
    });

    describe("dropWhile", () => {
        it("should drop while the predicate returns true and then return the rest", () => {
            const seq = Sequence.of([1, 1, 1, 1, 1, 2, 3, 4, 5]).dropWhile(x => x === 1);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 5]);
        });

        it("should be repeatedly consumable", () => {
            const seq = Sequence.of([1, 1, 1, 1, 1, 2, 3, 4, 5]).dropWhile(x => x === 1);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 5]);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 5]);
        });
    });

    describe("filter", () => {
        it("only keep items that pass the predicate", () => {
            const seq = Sequence.of([1, 2, 3, 4, 5]).filter(x => x % 2 == 1);
            expect(seq.toArray()).toMatchObject([1, 3, 5]);
        });

        it("should be repeatedly consumable", () => {
            const seq = Sequence.of([1, 2, 3, 4, 5]).filter(x => x % 2 == 1);
            expect(seq.toArray()).toMatchObject([1, 3, 5]);
            expect(seq.toArray()).toMatchObject([1, 3, 5]);
        });
    });

    describe("take", () => {
        it("Take n elements from the seq", () => {
            const seq = Sequence.of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).take(5);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5]);
        });

        it("should gracefully handle a small seq", () => {
            const seq = Sequence.of([1, 2, 3, 4]).take(5);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4]);
        });

        it("should gracefully handle an empty seq", () => {
            const seq = Sequence.of([]).take(5);
            expect(seq.toArray()).toMatchObject([]);
        });

        it("should be repeatedly consumable", () => {
            const seq = Sequence.of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).take(5);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5]);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5]);
        });
    });

    describe("takeWhile", () => {
        it("Take from the sequence while pred returns true", () => {
            const seq = Sequence.of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).takeWhile(x => x <= 5);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5]);
        });

        it("should be repeatedly consumable", () => {
            const seq = Sequence.of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).takeWhile(x => x <= 5);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5]);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4, 5]);
        });
    });

    describe("takeLast", () => {
        it("Take the last n from the seq", () => {
            const seq = Sequence.of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).takeLast(5);
            expect(seq.toArray()).toMatchObject([6, 7, 8, 9, 10]);
        });

        it("should gracefully handle a small seq", () => {
            const seq = Sequence.of([1, 2, 3, 4]).takeLast(5);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4]);
        });

        it("should gracefully handle an empty seq", () => {
            const seq = Sequence.of([]).takeLast(5);
            expect(seq.toArray()).toMatchObject([]);
        });

        it("should be repeatedly consumable", () => {
            const seq = Sequence.of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).takeLast(5);
            expect(seq.toArray()).toMatchObject([6, 7, 8, 9, 10]);
            expect(seq.toArray()).toMatchObject([6, 7, 8, 9, 10]);
        });
    });

    describe("takeNth", () => {
        it("Take the last n from the seq", () => {
            const seq = Sequence.of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).takeNth(3);
            expect(seq.toArray()).toMatchObject([1, 4, 7, 10]);
        });

        it("should gracefully handle a small seq", () => {
            const seq = Sequence.of([1, 2, 3, 4]).takeNth(6);
            expect(seq.toArray()).toMatchObject([1]);
        });

        it("should gracefully handle an empty seq", () => {
            const seq = Sequence.of([]).takeNth(5);
            expect(seq.toArray()).toMatchObject([]);
        });

        it("should be repeatedly consumable", () => {
            const seq = Sequence.of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).takeNth(3);
            expect(seq.toArray()).toMatchObject([1, 4, 7, 10]);
            expect(seq.toArray()).toMatchObject([1, 4, 7, 10]);
        });
    });

    describe("distinct", () => {
        it('should remove duplicates from the seq', () => {
            const seq = Sequence.of([1, 2, 3, 1, 2, 3, 1, 2, 3]).distinct();
            expect(seq.toArray()).toMatchObject([1, 2, 3]);
        });

        it('should be repeatedly consumable', () => {
            const seq = Sequence.of([1, 2, 3, 1, 2, 3, 1, 2, 3]).distinct();
            expect(seq.toArray()).toMatchObject([1, 2, 3]);
            expect(seq.toArray()).toMatchObject([1, 2, 3]);
        });
    });

    describe("remove", () => {
        it('should remove items where pred(x) is true', () => {
            const seq = Sequence.of([1, 2, 3, 4, 5]).remove(x => x % 2 === 0);
            expect(seq.toArray()).toMatchObject([1, 3, 5]);
        });

        it('should be repeatedly consumable', () => {
            const seq = Sequence.of([1, 2, 3, 4, 5]).remove(x => x % 2 === 0);
            expect(seq.toArray()).toMatchObject([1, 3, 5]);
            expect(seq.toArray()).toMatchObject([1, 3, 5]);
        });
    });

    describe("dedupe", () => {
        it('should remove consecutive duplicates', () => {
            const seq = Sequence.of([1, 1, 2, 2, 1]).dedupe();
            expect(seq.toArray()).toMatchObject([1, 2, 1]);
        });

        it('should be repeatedly consumable', () => {
            const seq = Sequence.of([1, 1, 2, 2, 1]).dedupe();
            expect(seq.toArray()).toMatchObject([1, 2, 1]);
            expect(seq.toArray()).toMatchObject([1, 2, 1]);
        });
    });

    describe("butLast", () => {
        it('returns a sequence with all but the last element', () => {
            const seq = Sequence.range(1, 5).butLast();
            expect(seq.toArray()).toMatchObject([1, 2, 3]);
        });

        it('should be repeatedly consumable', () => {
            const seq = Sequence.range(1, 5).butLast();
            expect(seq.toArray()).toMatchObject([1, 2, 3]);
            expect(seq.toArray()).toMatchObject([1, 2, 3]);
        });
    });

    describe("compact", () => {
        it('should return a sequence with all of the falsey values removed', () => {
            const seq = Sequence.range().take(5).compact();
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4]);
        });

        it('should with only void values removed if flagged for it', () => {
            const seq = Sequence.ofItems(undefined, 0, null, 1, null, 2, undefined, 3, 4, null).compact(true);
            expect(seq.toArray()).toMatchObject([0, 1, 2, 3, 4]);
        });

        it('should be repeatedly consumable', () => {
            const seq = Sequence.range().take(5).compact();
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4]);
            expect(seq.toArray()).toMatchObject([1, 2, 3, 4]);
        });
    });

    describe("slice", () => {
        it("should return the slice of the sequence from start onwards", () => {
            const seq = Sequence.range().slice(2).take(5);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 5, 6]);
        });

        it("should return the slice of the sequence from start to end", () => {
            const seq = Sequence.range().slice(2, 7);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 5, 6]);
        });

        it('should be repeatedly consumable', () => {
            const seq = Sequence.range().slice(2, 7);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 5, 6]);
            expect(seq.toArray()).toMatchObject([2, 3, 4, 5, 6]);
        });
    });

});