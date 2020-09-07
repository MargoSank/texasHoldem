import {Combination} from "./CombinationEnum";
import {CardRank} from "./CardRankEnum";

export function inputSizeCheck(inputLine: string): boolean {
    if (inputLine.length % 2 !== 0 || inputLine.length < 14) {
        return false;
    }
    return true;
}

export function inputDuplicatesCheck(cardsArray: string[]): boolean {
    const hasDuplicate = cardsArray.some((val, i) => cardsArray.indexOf(val) !== i);
    if (hasDuplicate) {
        return false;
    }
    return true;
}

export function inputCharacterCheck(cardsArray: string[], inputLine: string): boolean {
    if (cardsArray.length !== inputLine.match(/[AKQJT98765432][hdsc]/g).length) {
        return false;
    }
    return true;
}

export function inputCheck(inputLine: string): boolean {
    const cardsArray = inputLine.match(/.{2}/g);
    if (!inputSizeCheck(inputLine)) {
        console.log("Input size error");
        return false;
    }
    if (!inputDuplicatesCheck(cardsArray)) {
        console.log("Input error (there are duplicates)");
        return false;
    }
    if (!inputCharacterCheck(cardsArray, inputLine)) {
        console.log("Input error (error in card designation)");
        return false;
    }
    return true;
}

export function getBestCards(cards: [], counts: number): string {

    return "";
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
    }
}

export function getCardSuits(card: string): string {
    return card[1];
}

export function compare(a: string, b: string) {
    return getCardValue(b) - getCardValue(a);
}

function groupByKey<T>(entries: T[], getKey: (element: T) => string) {
    return entries.reduce<{ [key: string]: T[] }>((groups, element) => {
        const key = getKey(element);
        if (!(key in groups)) {
            groups[key] = [];
        }
        groups[key].push(element);
        return groups;
    }, {});
}

export function isHighCard(hand: string[]) {
    return ({
            combination: Combination.HighCard,
            fiveCards: hand.slice(0, 5),
        }
    );
}

export function isPair(hand: string[]) {
    const groups = groupByKey(hand, (el) => getCardValue(el).toString());
    const twoPair = Object.values(groups).reverse().find(cards => cards.length >= 2);
    const highCard = hand.filter(cards => getCardValue(cards) !== getCardValue(twoPair[0])).slice(0,3);
    if (twoPair) {
        return ({
                combination: Combination.Pair,
                fiveCards: twoPair.concat(...highCard),
            }
        );
    } else {
        return false;
    }
}

export function isTwoPairs(hand: string[]) {
    const groups = groupByKey(hand, (el) => getCardValue(el).toString());
    const pairs = Object.values(groups).reverse()
        .filter(cards => cards.length >= 2);
    if (pairs.length >= 2) {
        const firstPair = pairs[0];
        const secondPair = pairs[1];
        const highCard = hand
            .filter(cards => getCardValue(cards) !== getCardValue(firstPair[0]))
            .filter(cards => getCardValue(cards) !== getCardValue(secondPair[0]))
            .slice(0,1);
        return ({
                combination: Combination.TwoPairs,
                fiveCards: [...firstPair, ...secondPair, ...highCard],
            }
        );
    } else {
        return false;
    }
}

export function isThreeOfKind(hand: string[]) {
    const three = groupByKey(hand, (el) => getCardValue(el).toString());
    const threeOfKind = Object.values(three).reverse().find(cards => cards.length >= 3);
    const highCard = hand.filter(cards => getCardValue(cards) !== getCardValue(threeOfKind[0])).slice(0,2);
    if (threeOfKind) {
        return ({
                combination: Combination.ThreeOfKind,
                fiveCards: threeOfKind.concat(...highCard),
            }
        );
    } else {
        return false;
    }

}

export function isStraight(hand: string[]): CombinationResponse {
    hand.reverse();
    if (getCardValue(hand[0]) === CardRank.c2 && getCardValue(hand[6]) === CardRank.cA) {
        hand.unshift(hand[6]);
    }
    const compareStraight = (cardA, cardB) => (getCardValue(cardA) === CardRank.cA && getCardValue(cardB) === CardRank.c2) ? 1 : compare(cardA, cardB);

    const notDuplicate = hand.filter((element, idx, array) => {
        if (idx === array.length - 1) {
            return element;
        }
        return compareStraight(element[0], array[idx + 1][0]) > 0;
    });

    const straightCheck = notDuplicate.map((element, idx, array) => {
        if (idx === array.length - 1) {
            return null;
        }
        return compareStraight(element[0], array[idx + 1][0]);
    });

    const checkSum = straightCheck.reduce(({sum, max, maxIdx}, distance, idx) => {
        distance >= 2 ? sum = 0 : sum += distance;
        if (sum >= max) {
            max = sum;
            maxIdx = idx;
        }
        return {sum, max, maxIdx};
    }, {sum: 0, max: -1, maxIdx: -1});

    if (checkSum.max >= 4) {
        let fiveCards = notDuplicate.slice(checkSum.maxIdx >= 4 ? checkSum.maxIdx - 4 : 0, checkSum.maxIdx + 2).reverse();
        return ({
                combination: Number(Combination.Straight),
                fiveCards: fiveCards,
            }
        );
    } else {
        return false;
    }
}

export function isFlush(hand: string[]) {
    const groups = groupByKey(hand, getCardSuits);
    const flush = Object.values(groups).find(cards => cards.length >= 5);
    if (flush) {
        return ({
                combination: Combination.Flush,
                fiveCards: flush.slice(0, 5),
            }
        );
    } else {
        return false;
    }
}


export function isFullHouse(hand: string[]) {
    const groups = groupByKey(hand, (el) => getCardValue(el).toString());
    const x = Object.values(groups).reverse();
    const tree = x.find(cards => cards.length >= 3);
    const twos = x.filter(cards => cards !== tree).find(cards => cards.length >= 2).slice(0, 2);
    if (tree && twos) {
        return ({
                combination: Combination.FullHouse,
                fiveCards: tree.concat(twos),
            }
        );
    } else {
        return false;
    }
}

export function isFourOfKind(hand: string[]): CombinationResponse {
    const groups = groupByKey(hand, (el) => getCardValue(el).toString());
    const four = Object.values(groups).reverse().find(cards => cards.length === 4);
    const highCard = hand.find(cards => getCardValue(cards) !== getCardValue(four[0]));
    if (four) {
        return ({
                combination: Combination.FourOfKind,
                fiveCards: four.concat(highCard),
            }
        );
    } else {
        return false;
    }
}

type CombinationResponse = {
    combination: Combination;
    fiveCards: string[];
} | false;

export function isStraightFlush(hand: string[]): CombinationResponse {
    const groups = groupByKey(hand, getCardSuits);
    const flush = Object.values(groups).find(cards => cards.length >= 5);
    if (flush) {
        const straight = isStraight(flush);
        if (straight) {
            return {
                combination: Combination.StraightFlush,
                fiveCards: straight.fiveCards,
            };
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export function isRoyalFlush(hand: string[]): CombinationResponse {
    const straightFlush = isStraightFlush(hand);
    if (!straightFlush) {
        return false;
    }
    if (getCardValue(straightFlush.fiveCards[0]) === CardRank.cA) {
        return {
            combination: Combination.RoyalFlush,
            fiveCards: straightFlush.fiveCards,
        };
    } else {
        return false;
    }
}

export function divisionIntoObjects(inputLine: string): { handId: number; handCards: string; boardCard: string; combination: undefined }[] {
    const boardCard: string = inputLine.match(/[AKQJT98765432hdsc]{10}/)[0];
    const handCards: string[] = inputLine.replace(/[AKQJT98765432hdsc]{10}/, "").match(/.{4}/g);
    const hands = handCards.map((element, idx) => {
        return ({
                handId: idx,
                handCards: element.toString(),
                boardCard: boardCard + element,
                combination: undefined,
            }
        );
    });
    return hands;
}

export function main(inputLine: string): string {
    inputLine = inputLine.replace(/ /g, "");
    if (!inputCheck(inputLine)) {
        return "error";
    }
    const allHands = divisionIntoObjects(inputLine);
    // const combinationCheckFunction = [isRoyalFlush(), isStraightFlush(), isFourOfKind(), isFullHouse(), isFlush(), isStraight(),
    //     isThreeOfKind(), isTwoPairs(), isPair(), isHighcard()];
    //
    // const handsAllInfo = allHands.map((element) => {
    //     return element = isHighcard(element);
    // })
    return "";
}

