import {Combination} from "./CombinationEnum";

export function inputCheck(line: string): boolean {
    line.trim();
    if (line.length % 2 !== 0 || line.length < 14) {
        console.log("Input error");
        return false;
    }
    const cards = line.match(/.{1,2}/g);
    let hasDuplicate = cards.some((val, i) => cards.indexOf(val) !== i);
    if (hasDuplicate) {
        console.log("Input error (there are duplicates)");
        return false;
    }
    if (cards.length !== line.match("[AKQJT98765432]{1}[hdsc]{1}").length) {
        console.log("Input error (error in card designation)");
        return false;
    }
    return true;
}


export function getBestCards(cards: [], counts: number): string {

    return "";
}

export function getCartValue(card: string): number {
    switch (card.charAt(0)) {
        case "A" :
            return 14;
        case "K" :
            return 13;
        case "Q" :
            return 12;
        case "J" :
            return 11;
        case "T" :
            return 10;
        default:
            return Number(card.charAt(0));
    }
}

export function compare(a, b) {
    a = getCartValue(a);
    b = getCartValue(b);
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

export function isPair() {
    return 43;
}

export function isTwoPairs() {
    return 43;
}

export function isThreeOfKind() {
    return 43;
}

export function isStraight() {
    return 43;
}

export function isFlush() {
    return 43;
}

export function isFullHouse() {
    return 43;
}

export function isFourOfKind() {
    return 43;
}

export function isStraightFlush() {
    return 43;
}

export function isRoyalFlush() {
    return 43;
}

export function main() {

}

