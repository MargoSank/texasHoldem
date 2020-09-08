import {CardRank} from "./CardRankEnum";
import {Combination} from "./CombinationEnum";

export function getCardSuits(card: string): string {
    return card[1];
}

export function getCardValue(card: string): CardRank {
    switch (card[0]) {
        case "A" :
            return CardRank.cA;
        case "K" :
            return CardRank.cK;
        case "Q" :
            return CardRank.cQ;
        case "J" :
            return CardRank.cJ;
        case "T" :
            return CardRank.cT;
        case "9" :
            return CardRank.c9;
        case "8" :
            return CardRank.c8;
        case "7" :
            return CardRank.c7;
        case "6" :
            return CardRank.c6;
        case "5" :
            return CardRank.c5;
        case "4" :
            return CardRank.c4;
        case "3" :
            return CardRank.c3;
        case "2" :
            return CardRank.c2;
        default:
            throw new Error("Unknown card");
    }
}

export function compare(a: string, b: string) {
    return getCardValue(b) - getCardValue(a);
}

export type CombinationResponse = {
    combination: Combination;
    fiveCards: string[];
};
type CombinationResponseWithHand = {
    combination: CombinationResponse;
    hand: string;
};
export type CombinationResponseOrFalse = CombinationResponse | false;

export function compareHands(handComb1: CombinationResponse, handComb2: CombinationResponse): number {
    const delta = handComb1.combination - handComb2.combination;
    if (delta !== 0) {
        return delta;
    } else {
        for (let i = 0; i >= handComb1.fiveCards.length; i++) {
            const deltaCard = compare(handComb1.fiveCards[i], handComb2.fiveCards[i]);
            if (deltaCard !== 0) {
                return deltaCard;
            }
        }
    }
    return 0;
}

export function compareHandsAlphabetically(hand1: CombinationResponseWithHand, hand2: CombinationResponseWithHand): number {
    const delta = compareHands(hand1.combination, hand2.combination);
    if (delta === 0) {
        return hand1.hand.localeCompare(hand2.hand);
    } else {
        return delta;
    }
}

export function combine(a: RegExpMatchArray, min: number): string[][] {
    let fn = function (n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (let j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    const all:string[][] = [];
    for (let i = min; i < a.length; i++) {
        fn(i, a, [], all);
    }
    // @ts-ignore
    all.push(a);
    return all;
}

export function combineCards(hand: string, board: string): string[] {
    const handCombination: string[][] = combine(hand.match(/.{2}/g) || [], 2).filter(comb => comb.length == 2);
    const boardCombination: string[][] = combine(board.match(/.{2}/g) || [], 3).filter(comb => comb.length == 3);
    const combos: string[] = [];

    for (let i = 0; i < boardCombination.length; i++) {
        for (let j = 0; j < handCombination.length; j++) {
            combos.push([...boardCombination[i], ...handCombination[j]].join(""));
        }
    }
    return combos;
}
