import {
    compare,
    getCardValue,
    isFlush,
    isFourOfKind,
    isFullHouse,
    isHighCard,
    isPair,
    isRoyalFlush,
    isStraight,
    isStraightFlush,
    isThreeOfKind,
    isTwoPairs,
    searchForCombinations,
    validateInputCharacters,
    validateInputDuplicates,
    validateInputSize
} from "./Main";
import {Combination} from "./CombinationEnum";

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

describe("Combination validation", () => {
    it('Highcard', () => {
        expect(isHighCard("4cKs4h8s7sAd4s".match(/.{2}/g).sort(compare)
        )).toStrictEqual({
            combination: Combination.HighCard,
            fiveCards: ["Ad", "Ks", "8s", "7s", "4c"]
        });
    });

    it('Pair', () => {
        expect(isPair("5cKs4h8s7sAd4s".match(/.{2}/g).sort(compare)))
            .toStrictEqual({
                combination: Combination.Pair,
                fiveCards: ["4h", "4s", "Ad", "Ks", "8s"]
            });
    });


    it('TwoPairs', () => {
        expect(isTwoPairs("AcKs4h8s7sAd4s".match(/.{2}/g).sort(compare)))
            .toStrictEqual({
                combination: Combination.TwoPairs,
                fiveCards: ["Ac", "Ad", "4h", "4s", "Ks"]
            });
    });

    it('ThreeOfKind', () => {
        expect(isThreeOfKind("4cKs4h8s7sAd4s".match(/.{2}/g).sort(compare)
        )).toStrictEqual({
            combination: Combination.ThreeOfKind,
            fiveCards: ["4c", "4h", "4s", "Ad", "Ks"]
        });
    });

    it('Straight low', () => {
        expect(isStraight("6cKsTh9s7sAd8s".match(/.{2}/g).sort(compare))).toStrictEqual({
            combination: Combination.Straight,
            fiveCards: ["Th", "9s", "8s", "7s", "6c"]
        });
    });

    it('Straight high', () => {
        expect(isStraight("AsKdQsJsTc3c2d".match(/.{2}/g).sort(compare)
        )).toStrictEqual({
            combination: Combination.Straight,
            fiveCards: ["As", "Kd", "Qs", "Js", "Tc"]
        });
    });

    it('Straight Ace precede 2', () => {
        expect(isStraight("4c5sAhKs7s2d3s".match(/.{2}/g).sort(compare),
        )).toStrictEqual({
            combination: Combination.Straight,
            fiveCards: ["5s", "4c", "3s", "2d", "Ah"]
        });
    });

    it('Straight 5 5 5 ', () => {
        expect(isStraight("3d4s5h5s5c6h7h".match(/.{2}/g).sort(compare),
        )).toStrictEqual({
            combination: Combination.Straight,
            fiveCards: ["7h", "6h", "5h", "4s", "3d"]
        });
    });

    it('Flush sssss', () => {
        expect(isFlush("AsQsTs9s5h5c2s".match(/.{2}/g).sort(compare)))
            .toStrictEqual({
                combination: Combination.Flush,
                fiveCards: ["As", "Qs", "Ts", "9s", "2s"]
            });
    });

    it('Full house', () => {
        expect(isFullHouse("AsAcTs9s5h5c5s".match(/.{2}/g).sort(compare),
        )).toStrictEqual({
            combination: Combination.FullHouse,
            fiveCards: ["5h", "5c", "5s", "As", "Ac"]
        });
    });

    it('Four Of Kind', () => {
        expect(isFourOfKind("As9cTs9s9d9h5s".match(/.{2}/g).sort(compare)))
            .toStrictEqual({
                combination: Combination.FourOfKind,
                fiveCards: ["9c", "9s", "9d", "9h", "As"]
            });
    });

    it('StraightFlush', () => {
        expect(isStraightFlush("KsQcJsTs9s8s7s".match(/.{2}/g).sort(compare)))
            .toStrictEqual({
                combination: Combination.StraightFlush,
                fiveCards: ["Js", "Ts", "9s", "8s", "7s"]
            });
    });

    it('not StraightFlush but straight', () => {
        expect(isStraightFlush("KsQcJsTs5s8s7s".match(/.{2}/g).sort(compare)))
            .toBeFalsy()
    });


    it('RoyalFlush', () => {
        expect(isRoyalFlush("AsKsQsJsTs8d7c".match(/.{2}/g).sort(compare)))
            .toStrictEqual({
                combination: Combination.RoyalFlush,
                fiveCards: ["As", "Ks", "Qs", "Js", "Ts"]
            });
    });
});


it('searchForCombinations flush', () => {
    expect(searchForCombinations("2h3h4h5d8d9hJh")).toStrictEqual({
        combination: Combination.Flush,
        fiveCards: ["Jh", "9h", "4h", "3h", "2h"]
    });
});

it('searchForCombinations high card', () => {
    expect(searchForCombinations("2h3s4c5d8d9hKh")).toStrictEqual({
        combination: Combination.HighCard,
        fiveCards: ["Kh", "9h", "8d", "5d", "4c"]
    });
});

//
// it('main', () => {
//     expect(main("2h3h4h5d8d 9hJh KdKs")).toStrictEqual("KdKs 9hJh");
// });

