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
        for (let i = 0; i < handComb1.fiveCards.length; i++) {
            const deltaCard = compare(handComb2.fiveCards[i], handComb1.fiveCards[i]);
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

export function combIndex(n, k, lo = 1, level = 1, acc: number[] = []): number[][] {
    if (level === k + 1) {
        return [acc];
    }
    const res: number[][] = [];
    for (let i = lo; i <= n - k + level; i++) {
        res.push(...combIndex(n, k, i + 1, level + 1, [...acc, i]));
    }
    return res;
}

export function combination(cardsString: string[], k: number): string[][] {
    return combIndex(cardsString.length, k).map((c) => {
        return c.map((idx) => cardsString[idx - 1]);
    });
}

export function getAllCombination(board: string, hand: string): string[] {
    const boardComb = combination(board.match(/.{2}/g) || [], 3);
    const handComb = combination(hand.match(/.{2}/g) || [], 2);
    const allComb: string[] = [];
    for (let b of boardComb) {
        for (let h of handComb) {
            allComb.push([...b, ...h].join(""));
        }
    }
    return allComb;
}
