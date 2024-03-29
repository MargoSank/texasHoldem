export function validateInputSize(inputLine: string, size: number) {
    if (inputLine.length !== size) {
        throw new Error("Input size error");
    }
}

export function validateInputDuplicates(inputLine: string) {
    const allCards = inputLine.replace(/ /g, "").match(/.{2}/g) || [];
    const hasDuplicate = allCards.some((val, i) => allCards.indexOf(val) !== i);
    if (hasDuplicate) {
        throw new Error("Input error (there are duplicates)");
    }
}

export function validateInputCharacters(inputLine: string) {
    if (!(/^([AKQJT98765432][hdsc])+$/g).test(inputLine)) {
        throw new Error("Input error (error in card designation)");
    }
}
