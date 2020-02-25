import {Vector} from "./vector";

describe("Vector", () => {
    describe("take", () => {
        it("should take elements with no transformations", () => {
            const v = Vector.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).take(3);
            expect(v.toArray()).toMatchObject([1, 2, 3])
        });
        it("should take elements with transformations", () => {
            const v = Vector.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
                .filter(x => x % 2 == 0)
                .take(3);
            console.log("To array", v.toArray());
            expect(v.toArray()).toMatchObject([2, 4, 6])
        });
        it("should take elements with some with transformations, some without", () => {
            const v = Vector.of(1, 2, 3, 4)
                .filter(x => x % 2 == 0)
                .concat([5, 6, 7, 8])
                .filter(x => x % 2 == 0)
                .take(3);
            console.log("To array", v.toArray());
            expect(v.toArray()).toMatchObject([2, 4, 6])
        })
    })
});