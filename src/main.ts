import {searchForCombinations} from "./combinationMatcher";

import * as readline from "readline";
import {compareHands, compareHandsAlphabetically, getAllCombination} from "./utils";
import {validateInputCharacters, validateInputDuplicates, validateInputSize} from "./validation";

export function main(inputLine: string, isOmaha = false): string {
    const allCards = inputLine.split(/ /g);
    const [board, ...hands] = allCards;

    //Input validation
    try {
        hands.forEach((cardSet) => validateInputSize(cardSet, isOmaha ? 8 : 4));
        validateInputSize(board, 10);
        validateInputDuplicates(inputLine);
        allCards.forEach(cards => validateInputCharacters(cards));
    } catch (e) {
        return e.message;
    }

    const combinationForHoldem = (hand, board) => searchForCombinations(board + hand)
    const combinationForOmaha = (hand, board) => {
        const allPossibleHandCombinations = getAllCombination(board, hand).map(cards => searchForCombinations(cards));
        allPossibleHandCombinations.sort((a,b) => compareHands(b, a));
        return allPossibleHandCombinations[0]
    }

    //Search for combinations in hands
    const handsResult = hands.map(hand => ({
        combination: isOmaha ? combinationForOmaha(hand, board) : combinationForHoldem(hand, board),
        hand
    }))

    // Hand comparison
    handsResult.sort(compareHandsAlphabetically);

    return handsResult.reduce((resultString, handCards, idx) => {
        if (idx === 0) {
            return resultString + handCards.hand;
        } else if (compareHands(handsResult[idx - 1].combination, handCards.combination) === 0) {
            return resultString + "=" + handCards.hand
        } else {
            return resultString + " " + handCards.hand;
        }
    }, "");
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const isOmaha = process.argv[2] === "--omaha";
rl.on('line', function (str) {
    console.log(main(str, isOmaha));
})

