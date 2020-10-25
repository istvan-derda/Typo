import {useState} from "react";

type TypoTextState = {
    readonly lines: String[]
    readonly lineIndex: number
    readonly charIndex: number
}

type TypoText = {
    typedText: String
    textToType: String
    nextChar: String
    moveForward: () => void
    moveBack: () => void
}

const endOfPracticeText: TypoTextState = {
    lines: ["End of practice. Type '/help' to see a list of available commands"],
    charIndex: 0,
    lineIndex: 0
}


function useTypoText(initialText: TypoTextState): TypoText {
    const [{lines, lineIndex, charIndex}, setTypoText] = useState<TypoTextState>(initialText)

    const lastCharIndex = lines[lineIndex].length - 1
    const lastLineIndex = lines.length - 1

    function moveForward(prev: TypoTextState): TypoTextState {
        const newCharIndex = charIndex + 1
        if (newCharIndex > lastCharIndex) {
            return moveToNextLine(prev)
        }
        return ({...prev, charIndex: newCharIndex})
    }

    function moveBack(prev: TypoTextState) {
        const newCharIndex = charIndex - 1
        if (newCharIndex < 0) {
            return moveToPrevLine(prev);
        }
        return {...prev, charIndex: prev.charIndex - 1}
    }

    function moveToNextLine(prev: TypoTextState): TypoTextState {
        const newLineIndex = lineIndex + 1
        if (newLineIndex > lastLineIndex) {
            return endOfPracticeText
        }
        return {...prev, lineIndex: newLineIndex, charIndex: 0}
    }

    function moveToPrevLine(prev: TypoTextState) {
        const newLineIndex = lineIndex - 1
        if (newLineIndex < 0) {
            return prev
        }
        const newCharIndex = lines[newLineIndex].length - 1
        return {...prev, lineIndex: newLineIndex, charIndex: newCharIndex,}
    }

    return ({
        moveForward: () => setTypoText(prev => moveForward(prev)),
        moveBack: () => setTypoText(prev => moveBack(prev)),
        typedText: lines[lineIndex].substr(0, charIndex),
        nextChar: lines[lineIndex][charIndex],
        textToType: lines[lineIndex].substr(charIndex + 1, lines[lineIndex].length - 1),
    })
}

export default useTypoText
