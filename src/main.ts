import {searchForCombinations} from "./combinationMatcher";

import * as readline from "readline";
import {compareHands, compareHandsAlphabetically} from "./utils";
import {validateInputCharacters, validateInputDuplicates, validateInputSize} from "./validation";

export function main(inputLine: string): string {
    const allCards = inputLine.split(/ /g);
    const [board, ...hands] = allCards;

    //Input validation
    try {
        hands.forEach((cardSet) => validateInputSize(cardSet, 4));
        validateInputSize(board, 10);
        validateInputDuplicates(allCards);
        allCards.forEach(cards => validateInputCharacters(cards));
    } catch (e) {
        console.error(e.message)
    }

    //Search for combinations in hands
    const handsResult = hands.map(hand => ({
        combination: searchForCombinations(board + hand),
        hand
    }));

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

rl.on('line', function (str) {
    console.log(main(str));
})

