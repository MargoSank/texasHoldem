import {CardRank} from "./CardRankEnum";
import {Combination} from "./CombinationEnum";
import {CombinationResponse, CombinationResponseOrFalse, compare, getCardSuits, getCardValue} from "./utils";

export function isHighCard(hand: string[]): CombinationResponse {
    return ({
            combination: Combination.HighCard,
            fiveCards: hand.slice(0, 5),
        }
    );
}

export function isPair(hand: string[]): CombinationResponseOrFalse {
    const groups = groupByKey(hand, (el) => getCardValue(el).toString());
    const twoPair = Object.values(groups).reverse().find(cards => cards.length >= 2);
    if (twoPair) {
        const highCard = hand.filter(cards => getCardValue(cards) !== getCardValue(twoPair[0])).slice(0, 3);
        return ({
                combination: Combination.Pair,
                fiveCards: twoPair.concat(...highCard),
            }
        );
    } else {
        return false;
    }
}

export function isTwoPairs(hand: string[]): CombinationResponseOrFalse {
    const groups = groupByKey(hand, (el) => getCardValue(el).toString());
    const pairs = Object.values(groups).reverse()
        .filter(cards => cards.length >= 2);
    if (pairs.length >= 2) {
        const firstPair = pairs[0];
        const secondPair = pairs[1];
        const highCard = hand
            .filter(cards => getCardValue(cards) !== getCardValue(firstPair[0]))
            .filter(cards => getCardValue(cards) !== getCardValue(secondPair[0]))
            .slice(0, 1);
        return ({
                combination: Combination.TwoPairs,
                fiveCards: [...firstPair, ...secondPair, ...highCard],
            }
        );
    } else {
        return false;
    }
}

export function isThreeOfKind(hand: string[]): CombinationResponseOrFalse {
    const three = groupByKey(hand, (el) => getCardValue(el).toString());
    const threeOfKind = Object.values(three).reverse().find(cards => cards.length >= 3);
    if (threeOfKind) {
        const highCard = hand.filter(cards => getCardValue(cards) !== getCardValue(threeOfKind[0])).slice(0, 2);
        return ({
                combination: Combination.ThreeOfKind,
                fiveCards: threeOfKind.concat(...highCard),
            }
        );
    } else {
        return false;
    }
}

export function isStraight(hand: string[]): CombinationResponseOrFalse {
    let reversedHand = hand.slice().reverse();
    if (getCardValue(reversedHand[0]) === CardRank.c2 && getCardValue(reversedHand[reversedHand.length - 1]) === CardRank.cA) {
        reversedHand.unshift(reversedHand[reversedHand.length - 1]);
    }
    const compareStraight = (cardA, cardB) => (getCardValue(cardA) === CardRank.cA && getCardValue(cardB) === CardRank.c2) ? 1 : compare(cardA, cardB);

    const notDuplicate = reversedHand.filter((element, idx, array) => {
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
        (distance === null || distance >= 2) ? sum = 0 : sum += distance;
        if (sum >= max) {
            max = sum;
            maxIdx = idx;
        }
        return {sum, max, maxIdx};
    }, {sum: 0, max: -1, maxIdx: -1});

    if (checkSum.max >= 4) {
        const lo = checkSum.maxIdx - 3;
        const hi = checkSum.maxIdx + 1;
        let fiveCards = notDuplicate.slice(lo, hi + 1).reverse();
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
    const twos = tree && x.filter(cards => cards !== tree).find(cards => cards.length >= 2)?.slice(0, 2);
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

export function isFourOfKind(hand: string[]): CombinationResponseOrFalse {
    const groups = groupByKey(hand, (el) => getCardValue(el).toString());
    const four = Object.values(groups).reverse().find(cards => cards.length === 4);
    if (four) {
        const highCard = hand.find(cards => getCardValue(cards) !== getCardValue(four[0]));
        if (!highCard) {
            throw new Error("High card not found");
        }
        return ({
                combination: Combination.FourOfKind,
                fiveCards: four.concat(highCard),
            }
        );
    } else {
        return false;
    }
}

export function isStraightFlush(hand: string[]): CombinationResponseOrFalse {
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

export function isRoyalFlush(hand: string[]): CombinationResponseOrFalse {
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

export function searchForCombinations(cards: string): CombinationResponse {
    const combinationCheckFunction = [isRoyalFlush, isStraightFlush, isFourOfKind, isFullHouse, isFlush, isStraight,
        isThreeOfKind, isTwoPairs, isPair, isHighCard];

    const sortedCards = cards.match(/.{2}/g) || [];
    sortedCards.sort(compare);

    const result = combinationCheckFunction.reduce((result, checkFunction) => {
        return result || checkFunction(sortedCards);
    }, false);

    if (typeof result === "boolean") {
        throw new Error("Can't find combination");
    } else {
        return result;
    }
}
