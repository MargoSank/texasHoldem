import {main} from "./main";
import {Combination} from "./CombinationEnum";
import {searchForCombinations} from "./combinationMatcher";
import {compare, compareHands, getCardValue} from "./utils";
import {validateInputCharacters, validateInputDuplicates, validateInputSize} from "./validation";

describe("Input validation", () => {
    it('not enough characters', () => {
        expect(() => validateInputSize("4cKs4h8s", 10)).toThrow(Error);
    });

    it('Ok', () => {
        expect(() => validateInputSize("4cKs", 4)).not.toThrow();
    });

    it('(duplicates)', () => {
        expect(() => validateInputDuplicates("4cKs4h8s7s4cKs4h8s7s".match(/.{2}/g))).toThrow(Error);
    });

    it('(not duplicates)', () => {
        expect(() => validateInputDuplicates("4cKs4h8s7sAd4sAc4dAs9sKhKd5d6d".match(/.{2}/g))).not.toThrow();
    });

    it('(error in card designation)', () => {
        expect(() => validateInputCharacters("2p3h")).toThrow(Error);
    });
})

it('card evaluation check (A)', () => {
    expect(getCardValue("Ac")).toBe(14);
});

it('card evaluation check (K)', () => {
    expect(getCardValue("Kh")).toBe(13);
});

it('card evaluation check (Q)', () => {
    expect(getCardValue("Qd")).toBe(12);
});

it('card evaluation check (J)', () => {
    expect(getCardValue("Js")).toBe(11);
});

it('card evaluation check (T)', () => {
    expect(getCardValue("Th")).toBe(10);
});

it('card evaluation check (9)', () => {
    expect(getCardValue("9c")).toBe(9);
});

it('card evaluation check (2)', () => {
    expect(getCardValue("2d")).toBe(2);
});

it('Comparison check (Js, Ad => -1)', () => {
    expect(compare("Js", "Ad")).toBeGreaterThan(0);
});

it('Comparison check (As, Qd => 1)', () => {
    expect(compare("As", "Qd")).toBeLessThan(0);
});

it('Comparison check (5s, 5d => 0)', () => {
    expect(compare("5c", "5d")).toBe(0);
});

it('searchForCombinations high card', () => {
    expect(searchForCombinations("2h3s4c5d8d9hKh")).toStrictEqual({
        combination: Combination.HighCard,
        fiveCards: ["Kh", "9h", "8d", "5d", "4c"]
    });
});

it('sort hands > 0', () => {
    const hand1 = {
        combination: Combination.Flush,
        fiveCards: ['Jh', '9h', '4h', '3h', '2h']
    }
    const hand2 = {
        combination: Combination.Pair,
        fiveCards: ['Kd', 'Ks', '8d', '5d', '4h']
    };
    expect(compareHands(hand1, hand2)).toBeGreaterThan(0);
});

it('sort hands < 0', () => {
    const hand1 = {
        combination: Combination.Pair,
        fiveCards: ['Kd', 'Ks', '8d', '5d', '4h']
    }
    const hand2 = {
        combination: Combination.Flush,
        fiveCards: ['Jh', '9h', '4h', '3h', '2h']
    };
    expect(compareHands(hand1, hand2)).toBeLessThan(0);
});

it('sort hands === 0', () => {
    const hand1 = {
        combination: Combination.Flush,
        fiveCards: ['Jh', '9h', '4h', '3h', '2h']
    };
    const hand2 = {
        combination: Combination.Flush,
        fiveCards: ['Js', '9s', '4s', '3s', '2s']
    };
    expect(compareHands(hand1, hand2)).toBe(0);
});


it('main Hold em', () => {
    expect(main("2h3h4h5d8d 9hJh KdKs")).toStrictEqual("KdKs 9hJh");
});

it('main Hold em equal hands', () => {
    expect(main("4cKs4h8s7s Ad4s Ac4d As9s KhKd 5d6d")).toStrictEqual("Ac4d=Ad4s 5d6d As9s KhKd");
});

it('main Omaha', () => {
    expect(main("5cKs5h8s7s Ad4sAc4d As4hAh4c", true)).toStrictEqual("Ad4sAc4d=As4hAh4c");
});
