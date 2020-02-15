import {Sequence} from "./index";

describe("Utility functions", () => {
    describe("isEmpty", () => {
        it("should return 'true' when it's empty", () => {
            const seq = Sequence.of([]);
            expect(seq.isEmpty()).toBeTruthy();
        });

        it("should return 'true' when it's empty", () => {
            const seq = Sequence.of([1, 2, 3]).filter(x => x > 3);
            expect(seq.isEmpty()).toBeTruthy();
        });

        it("should be false when it contains something", () => {
            const seq = Sequence.ofItems(1, 2, 3);
            expect(seq.isEmpty()).toBeFalsy();
        })
    })
});