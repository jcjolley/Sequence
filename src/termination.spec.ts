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
    });
});