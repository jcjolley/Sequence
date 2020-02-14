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

    describe("next", () => {
        it("alias for rest(1)", () => {
            const seq = Sequence.of([1, 2, 3]).next();
            expect(seq.toArray()).toMatchObject([2, 3]);
        });

        it("should be repeatedly consumable", () => {
            const seq = Sequence.of([1, 2, 3]).next();
            expect(seq.toArray()).toMatchObject([2, 3]);
            expect(seq.toArray()).toMatchObject([2, 3]);
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

});