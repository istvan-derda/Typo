import React, {useEffect, useRef, useState} from 'react';
import './App.scss';
import TypingInterface from "./TypingInterface/TypingInterface";
import {TypoEvent, TypoText} from "./common/commonTypes";

enum ApplicationState {intro, inPractice, endOfPractice, endOfPracticeeMessage, paused, help}

function App() {
    //TODO: loading from file
    const [practiceText, setPracticeText] = useState<TypoText>(initializeTypoText([" "])) //eslint-disable-line
    const [currentText, setCurrentText] = useState<TypoText>(initializeTypoText([" "]));
    const [applicationState, setApplicationState] = useState<ApplicationState>(ApplicationState.intro);

    const fileInput = useRef<HTMLInputElement>(null);

    const handleEvent = (e: TypoEvent) => {
        switch (e) {
            case TypoEvent.pause:
                setApplicationState(ApplicationState.paused);
                break;
            case TypoEvent.getHelp:
                setApplicationState(ApplicationState.help);
                break;
            case TypoEvent.load:
                fileInput.current?.click();
                break;
        }
    }

    useEffect(() => {
        const introText = ["Welcome to Typo, a typing-trainer where you decide, what you want to type!", "\"Typo\" is an acronym for \"Your Online Typing Practices\". It is developed with React and Typescript and optimized for Mozilla Firefox."]
        const pauseText = ["resume"];
        const endOfPracticeText = ["End of practice. Type '/help' to see a list of available commands"];
        const helpText = ["/help: show this text. /pause: pause a practice. /load: load a new practice"];

        switch (applicationState) {
            case ApplicationState.endOfPractice:
                setApplicationState(ApplicationState.endOfPracticeeMessage)
                setCurrentText(initializeTypoText(endOfPracticeText));
                break;
            case ApplicationState.inPractice:
                setCurrentText(practiceText);
                break;
            case ApplicationState.help:
                setCurrentText((current) => {
                    setPracticeText(current);
                    return initializeTypoText(helpText);
                });
                break;
            case ApplicationState.paused:
                setCurrentText((current) => {
                    setPracticeText(current);
                    return initializeTypoText(pauseText);
                });
                break;
            case ApplicationState.intro:
                setCurrentText((current) => {
                    setPracticeText(current);
                    return initializeTypoText(introText);
                });
        }
    }, [applicationState]) //eslint-disable-line

    const incrementCursor = () => {
        console.log(applicationState)
        if (currentText.lines[currentText.lineIndex].length > currentText.charIndex) {
            setCurrentText(({charIndex, lineIndex, lines}) => {
                return {charIndex: charIndex + 1, lineIndex: lineIndex, lines: lines}
            });
            console.log("incr.char")
        } else if (currentText.lines.length > currentText.lineIndex + 1) {
            setCurrentText(({lines, lineIndex}) => ({lineIndex: lineIndex + 1, charIndex: 0, lines}));
            console.log("incr.line")
        } else {
            if (applicationState === ApplicationState.inPractice || applicationState === ApplicationState.intro) {
                setApplicationState(ApplicationState.endOfPractice);
                console.log("end of practice")
            } else if (applicationState === ApplicationState.paused) {
                setApplicationState(ApplicationState.inPractice);
            }
        }
    }

    return (
        <div className="ty-app">
            <h1 className={"ty-app-title"}>The beginning of Typo</h1>
            <div className={"ty-center"}>
                <TypingInterface
                    text={currentText}
                    handleEvent={handleEvent}
                    incrementCursor={incrementCursor}/>
            </div>
            <input ref={fileInput} type={"file"} hidden/>
        </div>
    );
}

export default App;

const initializeTypoText = (lines: string[]): TypoText => {
    return {lines: lines, lineIndex: 0, charIndex: 0}
}
