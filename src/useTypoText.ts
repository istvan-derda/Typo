import {useState} from "react";
import {endOfPracticeText} from "./resources/texts";

export type TypoTextState = {
    readonly lines: String[]
    readonly lineIndex: number
    readonly charIndex: number
}

export type TypoText = {
    readonly typedText: String
    readonly textToType: String
    readonly nextChar: String
    readonly moveForward: () => void
    readonly moveBack: () => void
    readonly setText: (lines: String[], charIndex?: number, lineIndex?: number) => void
}


function useTypoText(initialText: String[]): TypoText {
    const [{lines, lineIndex, charIndex}, setTypoText] = useState<TypoTextState>(toTypoText(initialText))

    const lastCharIndex = lines[lineIndex].length - 1
    const lastLineIndex = lines.length - 1

    function moveForward(prev: TypoTextState): TypoTextState {
        const newCharIndex = charIndex + 1
        if (newCharIndex > lastCharIndex + 1) {
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
            return toTypoText(endOfPracticeText)
        }
        return {...prev, lineIndex: newLineIndex, charIndex: 0}
    }

    function moveToPrevLine(prev: TypoTextState) {
        const newLineIndex = lineIndex - 1
        if (newLineIndex < 0) {
            return prev
        }
        const newCharIndex = lines[newLineIndex].length
        return {...prev, lineIndex: newLineIndex, charIndex: newCharIndex,}
    }

    function setText(lines: String[], charIndex: number = 0, lineIndex: number = 0) {
        setTypoText({
            lines: lines,
            lineIndex: lineIndex,
            charIndex: charIndex,
        })
    }

    return ({
        moveForward: () => setTypoText(prev => moveForward(prev)),
        moveBack: () => setTypoText(prev => moveBack(prev)),
        typedText: lines[lineIndex].substr(0, charIndex),
        nextChar: lines[lineIndex][charIndex],
        textToType: lines[lineIndex].substr(charIndex + 1, lines[lineIndex].length - 1),
        setText: setText,
    })
}


function toTypoText(lines: String[]): TypoTextState {
    return (
        {
            lines: lines,
            lineIndex: 0,
            charIndex: 0,
        }
    )
}

export default useTypoText
