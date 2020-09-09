import {combination, combIndex, compare, compareHands, getAllCombination, getCardValue} from "./utils";
import {Combination} from "./CombinationEnum";

describe("card evaluation check", () => {

    it('A', () => {
        expect(getCardValue("Ac")).toBe(14);
    });

    it('K', () => {
        expect(getCardValue("Kh")).toBe(13);
    });

    it('Q', () => {
        expect(getCardValue("Qd")).toBe(12);
    });

    it('J', () => {
        expect(getCardValue("Js")).toBe(11);
    });

    it('T', () => {
        expect(getCardValue("Th")).toBe(10);
    });

    it('9', () => {
        expect(getCardValue("9c")).toBe(9);
    });

    it('2', () => {
        expect(getCardValue("2d")).toBe(2);
    });
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

it('combinations indx', () => {
    expect(combIndex(4, 2)).toStrictEqual([[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]);
});

it('combination', () => {
    expect(combination(["a", "b", "c"], 2)).toStrictEqual([["a", "b"], ["a", "c"], ["b", "c"]]);
});
