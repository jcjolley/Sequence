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
    });

    describe("every", () => {
        it("should return true if every element passes pred", () => {
            const res = Sequence.range().take(5).every(x => x >= 0);
            expect(res).toBeTruthy();
        });

        it("should return false if any element fails pred", () => {
            const res = Sequence.range().take(5).every(x => x > 0);
            expect(res).toBeFalsy();
        })
    });

    describe("any", () => {
        it("should return true if any element passes pred", () => {
            const res = Sequence.range().take(5).any(x => x >= 4);
            expect(res).toBeTruthy();
        });

        it("should return false if every element fails pred", () => {
            const res = Sequence.range().take(5).any(x => x < 0);
            expect(res).toBeFalsy();
        })
    });

    describe("none", () => {
        it("should return false if any element passes pred", () => {
            const res = Sequence.range().take(5).none(x => x >= 4);
            expect(res).toBeFalsy();
        });

        it("should return true if every element fails pred", () => {
            const res = Sequence.range().take(5).none(x => x < 0);
            expect(res).toBeTruthy();
        })
    });

    describe("some", () => {
        it("should return the first element that passes pred", () => {
            const res = Sequence.range().take(5).some(x => x >= 4);
            expect(res).toEqual(4);
        });

        it("should return undefined if every element fails pred", () => {
            const res = Sequence.range().take(5).some(x => x < 0);
            expect(res).toBeUndefined();
        })
    })
});