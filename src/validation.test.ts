import {validateInputCharacters, validateInputDuplicates, validateInputSize} from "./validation";

describe("Input validation", () => {
    it('not enough characters', () => {
        expect(() => validateInputSize("4cKs4h8s", 10)).toThrow(Error);
    });

    it('Ok', () => {
        expect(() => validateInputSize("4cKs", 4)).not.toThrow();
    });

    it('(duplicates)', () => {
        expect(() => validateInputDuplicates("4cKs4h8s7s4cKs4h8s7s")).toThrow(Error);
    });

    it('(not duplicates)', () => {
        expect(() => validateInputDuplicates("8sQc8h4c2dKhQsQhTd")).not.toThrow();
    });

    it('(error in card designation)', () => {
        expect(() => validateInputCharacters("2p3h")).toThrow(Error);
    });
})
