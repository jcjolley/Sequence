import {Sequence} from "./index";

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
    });

    describe("first", () => {
        it("should return the first item in a sequence", () => {
            const res = Sequence.of([1,2,3,4,5]).first();
            expect(res).toEqual(1);
        });

        it("should gracefully handle an empty sequence", () => {
            const res = Sequence.of([]).first();
            expect(res).toBeUndefined();
        });
    });

    describe("second", () => {
        it("should return the second item in a sequence", () => {
            const res = Sequence.of([1,2,3,4,5]).second();
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

});