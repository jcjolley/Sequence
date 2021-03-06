import {Sequence} from "./index";
import {reduced} from "./utilities";

describe("Terminations of Sequence:", () => {
    describe("toArray", () => {
        it("should resolve into an array", () => {
            const arr = [1, 2, 3, 4, 5];
            const seq = Sequence.of(arr);
            const res = seq.toArray();

            expect(res).toBeInstanceOf(Array);
            expect(res).toHaveLength(5);
            expect(res).toMatchObject(arr);
        });

        it("should be repeatable", () => {
            const arr = [1, 2, 3, 4, 5];
            const seq = Sequence.of(arr).map(x => x + 1).take(3);
            const res1 = seq.toArray();
            const res2 = seq.toArray();
            const res3 = seq.toArray();
            expect(res1).toMatchObject(res2);
            expect(res2).toMatchObject(res3);
        });
    });

    describe("toMap", () => {
        it("should resolve into a Map", () => {
            const arr = [["a", 1], ["b", 2], ["c", 3]];
            const seq = Sequence.of(arr);
            const res = seq.toMap();

            expect(res).toBeInstanceOf(Map);
            expect(res.get("a")).toEqual(1);
            expect(res.get("b")).toEqual(2);
            expect(res.get("c")).toEqual(3);
        });

        it("should map sequences of sequences", () => {
            const map = Sequence.range().chunk(2).take(3).toMap();
            expect(map).toMatchObject(new Map([[0, 1], [2, 3], [4, 5]]))
        });

        it("should handle empty sequences", () => {
            const map = Sequence.of([]).toMap();
            expect(map).toMatchObject(new Map())
        });

        it("should be repeatable", () => {
            const arr = [["a", 1], ["b", 2], ["c", 3]];
            const seq = Sequence.of(arr);
            const res1 = seq.toMap();
            const res2 = seq.toMap();
            expect(res1).toMatchObject(res2)
        });
    });

    describe("toSet", () => {
        it("should resolve into a Set", () => {
            const arr = [1, 1, 1, 2, 3];
            const seq = Sequence.of(arr);
            const res = seq.toSet();

            expect(res).toBeInstanceOf(Set);
            expect(res.size).toEqual(3);
        });
    });

    describe("toObject", () => {
        it("should resovle into an Object", () => {
            const arr = [["a", 1], ["b", 2], ["c", 3]];
            const seq = Sequence.of(arr);
            const res = seq.toObject();

            expect(res).toBeInstanceOf(Object);
            expect(res.a).toEqual(1);
            expect(res.b).toEqual(2);
            expect(res.c).toEqual(3);
        })
    });

    describe("toString", () => {
        it("should return a single string from the sequence", () => {
            const res = Sequence.of(["This", "is", "a", "sentence"]).interpose(" ").append(".").toString();
            expect(res).toEqual("This is a sentence.");
        });

        it("should be repeatable", () => {
            const seq = Sequence.of(["This", "is", "a", "sentence"]).interpose(" ").append(".");
            expect(seq.toString()).toEqual("This is a sentence.");
            expect(seq.toString()).toEqual("This is a sentence.");
        });
    });

    describe("reduce", () => {
        it("should reduce a sequence into a single value", () => {
            const res = Sequence.of([1, 2, 3, 4, 5]).reduce((acc, x) => acc + x, 0);
            expect(res).toEqual(15)
        });

        it("should bail early if acc is instance of Reduced", () => {
            const res = Sequence.range().reduce((acc, x) => acc > 5 ? reduced(acc) : acc + x);
            expect(res).toEqual(6)
        });

        it("should reduce a sequence into a single value when no initial value is provided", () => {
            const res = Sequence.of([1, 2, 3, 4, 5]).reduce((acc, x) => acc + x);
            expect(res).toEqual(15)
        });
    });

    describe("fold", () => {
        it("should fold a sequence into a single value", () => {
            const res = Sequence.of([1, 2, 3, 4, 5]).fold((acc, x) => acc + x);
            expect(res).toEqual(15)
        });
        it("should bail if acc is ever instance of Reduced", () => {
            const res = Sequence.range().fold((acc, x) => acc > 5 ? reduced(acc) : acc + x);
            expect(res).toEqual(6)
        });
        it("should be repeatable", () => {
            const seq = Sequence.of([1, 2, 3, 4, 5]);
            expect(seq.fold((acc, x) => acc + x)).toEqual(15);
            expect(seq.fold((acc, x) => acc + x)).toEqual(15)
        });
    });

    describe("first", () => {
        it("should return the first item in a sequence", () => {
            const res = Sequence.of([1, 2, 3, 4, 5]).first();
            expect(res).toEqual(1);
        });

        it("should gracefully handle an empty sequence", () => {
            const res = Sequence.of([]).first();
            expect(res).toBeUndefined();
        });
    });

    describe("second", () => {
        it("should return the second item in a sequence", () => {
            const res = Sequence.of([1, 2, 3, 4, 5]).second();
            expect(res).toEqual(2);
        });

        it("should gracefully handle an empty sequence", () => {
            const res = Sequence.of([]).second();
            expect(res).toBeUndefined();
        });

        it("should gracefully handle sequence with only one element", () => {
            const res = Sequence.of([1]).second();
            expect(res).toBeUndefined();
        });
    });

    describe("nth", () => {
        it("should return the second item in a sequence", () => {
            const res = Sequence.of([1, 2, 3, 4, 5]).nth(1);
            expect(res).toEqual(2);
        });

        it("should gracefully handle an empty sequence", () => {
            const res = Sequence.of([]).nth(0);
            expect(res).toBeUndefined();
        });

        it("should gracefully handle sequence with only one element", () => {
            const res = Sequence.of([1]).nth(1);
            expect(res).toBeUndefined();
        });
    });

    describe("groupBy", () => {
        it("should group items by the result of the function provided", () => {
            const groupingFn = (x) => {
                if (x <= 3) return "x<=3";
                else if (x <= 6) return "3<x<=6";
                else return "x>6"
            };
            const map = Sequence.ofItems(1, 2, 3, 4, 5, 6, 7, 8, 9).groupBy(groupingFn);
            expect(map).toMatchObject(new Map([
                ["x<=3", Sequence.ofItems(1, 2, 3)],
                ["3<x<=6", Sequence.ofItems(4, 5, 6)],
                ["x>6", Sequence.ofItems(7, 8, 9)]
            ]))
        })
    });
    describe("forEach", () => {
        it("should iterate on the object for side effects, returning nothing", () => {
            // Don't use this method this way.  I'm creating a result purely to have something to test.
            let total = 0;
            Sequence.ofItems(1, 2, 3, 4, 5).forEach((n) => total += n);
            expect(total).toEqual(15)
        });

        it("should be repeatably callable", () => {
            // Don't use this method this way.  I'm creating a result purely to have something to test.
            let total = 0;
            const seq = Sequence.ofItems(1, 2, 3, 4, 5);
            seq.forEach((n) => total += n);
            expect(total).toEqual(15);

            let total2 = 0;
            seq.forEach((n) => total2 += n);
            expect(total2).toEqual(15)
        })
    })
});