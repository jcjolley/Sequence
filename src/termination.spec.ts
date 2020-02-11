import {Sequence} from "./index";

describe("Exit Edges of Sequence", () => {
    describe("toArray", () => {
        it("should resolve into an array", () => {
            const arr = [1, 2, 3, 4, 5];
            const seq = Sequence.of(arr);
            const res = seq.toArray();

            expect(res).toBeInstanceOf(Array);
            expect(res).toHaveLength(5);
            expect(res).toMatchObject(arr);
        })
    })
})