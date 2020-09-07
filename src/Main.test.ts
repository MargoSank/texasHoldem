import {
    compare,
    divisionIntoObjects,
    getCardValue,
    inputCharacterCheck,
    inputCheck,
    inputDuplicatesCheck,
    inputSizeCheck,
    isFlush,
    isFourOfKind,
    isFullHouse,
    isHighCard,
    isPair,
    isRoyalFlush,
    isStraight,
    isStraightFlush,
    isThreeOfKind,
    isTwoPairs
} from "./Main";
import {Combination} from "./CombinationEnum";

describe("Input validation", () => {
    test('not enough characters', () => {
        expect(inputSizeCheck("4cKs4h8s7s")).toBe(false);
    });

    test('Ok', () => {
        expect(inputSizeCheck("4cKs4h8s7sAd4s")).toBe(true);
    });

    test('(duplicates)', () => {
        expect(inputDuplicatesCheck("4cKs4h8s7s4cKs4h8s7s".match(/.{2}/g))).toBe(false);
    });

    test('(not duplicates)', () => {
        expect(inputDuplicatesCheck("4cKs4h8s7sAd4sAc4dAs9sKhKd5d6d".match(/.{2}/g))).toBe(true);
    });

    test('(error in card designation)', () => {
        expect(inputCharacterCheck("2p3p4h5d8p1dKs0hJh".match(/.{2}/g), "2p3p4h5d8p1dKs0hJh")).toBe(false);
    });

    test('correct input', () => {
        expect(inputCheck("4cKs4h8s7sAd4sAc4dAs9sKhKd5d6d")).toBe(true);
    });
    test('not correct input', () => {
        expect(inputCheck("4cKs4h8s7sAk4sAc4dAs9sKhKd0d6d")).toBe(false);
    });
})

xtest('Get information about all hands', () => {
    expect(divisionIntoObjects("4cKs4h8s7sAd4sAc4dAs9s")).toStrictEqual([{
        handId: 0,
        handCards: "Ad4s",
        allCards: "4cKs4h8s7sAd4s",
        combination: undefined,
        combinationCard: undefined
    }, {
        handId: 1,
        handCards: "Ac4d",
        allCards: "4cKs4h8s7sAc4d",
        combination: undefined,
        combinationCard: undefined
    }, {
        handId: 2,
        handCards: "As9s",
        allCards: "4cKs4h8s7sAs9s",
        combination: undefined,
        combinationCard: undefined
    }]);
});

test('card evaluation check (A)', () => {
    expect(getCardValue("Ac")).toBe(14);
});

test('card evaluation check (K)', () => {
    expect(getCardValue("Kh")).toBe(13);
});

test('card evaluation check (Q)', () => {
    expect(getCardValue("Qd")).toBe(12);
});

test('card evaluation check (J)', () => {
    expect(getCardValue("Js")).toBe(11);
});

test('card evaluation check (T)', () => {
    expect(getCardValue("Th")).toBe(10);
});

test('card evaluation check (9)', () => {
    expect(getCardValue("9c")).toBe(9);
});

test('card evaluation check (2)', () => {
    expect(getCardValue("2d")).toBe(2);
});

test('Comparison check (Js, Ad => -1)', () => {
    expect(compare("Js", "Ad")).toBeGreaterThan(0);
});

test('Comparison check (As, Qd => 1)', () => {
    expect(compare("As", "Qd")).toBeLessThan(0);
});

test('Comparison check (5s, 5d => 0)', () => {
    expect(compare("5c", "5d")).toBe(0);
});

describe("Combination validation", () => {
    test('Highcard', () => {
        expect(isHighCard("4cKs4h8s7sAd4s".match(/.{2}/g).sort(compare)
        )).toStrictEqual({
            combination: Combination.HighCard,
            fiveCards: ["Ad", "Ks", "8s", "7s", "4c"]
        });
    });

    test('Pair', () => {
        expect(isPair("5cKs4h8s7sAd4s".match(/.{2}/g).sort(compare)))
            .toStrictEqual({
            combination: Combination.Pair,
            fiveCards: ["4h", "4s", "Ad", "Ks", "8s"]
        });
    });


    test('TwoPairs', () => {
        expect(isTwoPairs("AcKs4h8s7sAd4s".match(/.{2}/g).sort(compare)))
            .toStrictEqual({
            combination: Combination.TwoPairs,
            fiveCards: ["Ac", "Ad", "4h", "4s", "Ks"]
        });
    });

    test('ThreeOfKind', () => {
        expect(isThreeOfKind("4cKs4h8s7sAd4s".match(/.{2}/g).sort(compare)
        )).toStrictEqual({
            combination: Combination.ThreeOfKind,
            fiveCards: ["4c", "4h", "4s", "Ad", "Ks"]
        });
    });

    test('Straight low', () => {
        expect(isStraight("6cKsTh9s7sAd8s".match(/.{2}/g).sort(compare))).
        toStrictEqual({
            combination: Combination.Straight,
            fiveCards: ["Th", "9s", "8s", "7s", "6c"]
        });
    });

    test('Straight high', () => {
        expect(isStraight("AsKdQsJsTc3c2d".match(/.{2}/g).sort(compare)
        )).toStrictEqual({
            combination: Combination.Straight,
            fiveCards: ["As", "Kd", "Qs", "Js", "Tc"]
        });
    });

    test('Straight Ace precede 2', () => {
        expect(isStraight("4c5sAhKs7s2d3s".match(/.{2}/g).sort(compare),
        )).toStrictEqual({
            combination: Combination.Straight,
            fiveCards: ["5s", "4c", "3s", "2d", "Ah"]
        });
    });

    test('Straight 5 5 5 ', () => {
        expect(isStraight("3d4s5h5s5c6h7h".match(/.{2}/g).sort(compare),
        )).toStrictEqual({
            combination: Combination.Straight,
            fiveCards: ["7h", "6h", "5h", "4s", "3d"]
        });
    });

    test('Flush sssss', () => {
        expect(isFlush("AsQsTs9s5h5c2s".match(/.{2}/g).sort(compare)))
            .toStrictEqual({
                combination: Combination.Flush,
                fiveCards: ["As", "Qs", "Ts", "9s", "2s"]
            });
    });

    test('Full house', () => {
        expect(isFullHouse("AsAcTs9s5h5c5s".match(/.{2}/g).sort(compare),
        )).toStrictEqual({
            combination: Combination.FullHouse,
            fiveCards: ["5h", "5c", "5s", "As", "Ac"]
        });
    });

    test('Four Of Kind', () => {
        expect(isFourOfKind("As9cTs9s9d9h5s".match(/.{2}/g).sort(compare)))
            .toStrictEqual({
                combination: Combination.FourOfKind,
                fiveCards: ["9c", "9s", "9d", "9h", "As"]
            });
    });

    test('StraightFlush', () => {
        expect(isStraightFlush("KsQcJsTs9s8s7s".match(/.{2}/g).sort(compare)))
            .toStrictEqual({
                combination: Combination.StraightFlush,
                fiveCards: ["Js", "Ts", "9s", "8s", "7s"]
            });
    });

    test('not StraightFlush but straight', () => {
        expect(isStraightFlush("KsQcJsTs5s8s7s".match(/.{2}/g).sort(compare)))
            .toBeFalsy()
    });


    test('RoyalFlush', () => {
        expect(isRoyalFlush("AsKsQsJsTs8d7c".match(/.{2}/g).sort(compare)))
            .toStrictEqual({
                combination: Combination.RoyalFlush,
                fiveCards: ["As", "Ks", "Qs", "Js", "Ts"]
            });
    });
});
// test('main', () => {
//     expect(main("2h3h4h5d8d KdKs 9hJh")).toBe("0");
// });

