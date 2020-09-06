import React, {useEffect, useRef, useState} from 'react';
import './App.scss';
import TypingInterface from "./TypingInterface/TypingInterface";
import {TypoCommand, TypoText} from "./common/commonTypes";

enum ApplicationState {intro, inPractice, endOfPractice, endOfPracticeeMessage, paused, help}

function App() {
    const [practiceText, setPracticeText] = useState<TypoText>(initializePractice([" "]))
    const [currentText, setCurrentText] = useState<TypoText>(initializePractice([" "]));
    const [applicationState, setApplicationState] = useState<ApplicationState>(ApplicationState.intro);

    const fileInput = useRef<HTMLInputElement>(null);

    const handleCommand = (e: TypoCommand) => {
        switch (e) {
            case TypoCommand.pause:
                setApplicationState(ApplicationState.paused);
                break;
            case TypoCommand.help:
                setApplicationState(ApplicationState.help);
                break;
            case TypoCommand.load:
                fileInput.current?.click();
                break;
            case TypoCommand.resume:
                setCurrentText(practiceText);
                break;
        }
    }

    useEffect(() => {
        const introText = ["Type this.", "Welcome to Typo, a typing-trainer where you decide, what you want to type!", "\"Typo\" is an acronym for \"Your Online Typing Practices\". It is developed with React and Typescript and optimized for Mozilla Firefox."]
        const pauseText = ["resume"];
        const endOfPracticeText = ["End of practice. Type '/help' to see a list of available commands"];
        const helpText = ["/resume: back to practice. /help: show this text. /pause: pause a practice. /load: load a new practice. You can start commands with either ':' or '/'"];

        switch (applicationState) {
            case ApplicationState.endOfPractice:
                setApplicationState(ApplicationState.endOfPracticeeMessage)
                setCurrentText(initializePractice(endOfPracticeText));
                break;
            case ApplicationState.inPractice:
                setCurrentText(practiceText);
                break;
            case ApplicationState.help:
                setCurrentText((current) => {
                    setPracticeText(current);
                    return initializePractice(helpText);
                });
                break;
            case ApplicationState.paused:
                setCurrentText((current) => {
                    setPracticeText(current);
                    return initializePractice(pauseText);
                });
                break;
            case ApplicationState.intro:
                setCurrentText((current) => {
                    setPracticeText(current);
                    return initializePractice(introText);
                });
        }
    }, [applicationState]) //eslint-disable-line

    const incrementCursor = () => {
        if (currentText.lines[currentText.lineIndex].length > currentText.charIndex) {
            setCurrentText(({charIndex, lineIndex, lines}) => {
                return {charIndex: charIndex + 1, lineIndex: lineIndex, lines: lines}
            });
        } else if (currentText.lines.length > currentText.lineIndex + 1) {
            setCurrentText(({lines, lineIndex}) => ({lineIndex: lineIndex + 1, charIndex: 0, lines}));
        } else {
            if (applicationState === ApplicationState.inPractice || applicationState === ApplicationState.intro) {
                setApplicationState(ApplicationState.endOfPractice);
            } else if (applicationState === ApplicationState.paused) {
                setApplicationState(ApplicationState.inPractice);
            }
        }
    }

    const onFileSelection = (e: React.FormEvent<HTMLInputElement>) => {
        const inputElement = (e.target as HTMLInputElement);
        let file = inputElement.files?.[0];
        if (file !== undefined) {
            let fileReader = new FileReader();
            fileReader.readAsText(file)
            fileReader.onload = () => {
                const practice = makeTypoTextFromPlainText(typeof fileReader.result === "string" ? fileReader.result : "")
                setPracticeText(practice)
                setCurrentText(practice)
            }
            fileReader.onerror = () => console.error(fileReader.error);
        }
    }

    const makeTypoTextFromPlainText = (plainText: string): TypoText => initializePractice(plainText.split("\n"))


    return (
        <div className="ty-app">
            <h1 className={"ty-app-title"}>The beginning of Typo</h1>
            <div className={"ty-center"}>
                <TypingInterface
                    text={currentText}
                    handleCommand={handleCommand}
                    incrementCursor={incrementCursor}/>
            </div>
            <input ref={fileInput} type={"file"} hidden onChange={onFileSelection}/>
        </div>
    );
}

export default App;

const initializePractice = (lines: string[]): TypoText => {
    return {lines: lines, lineIndex: 0, charIndex: 0}
}
