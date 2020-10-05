import React, {useEffect, useRef, useState} from 'react';
import './App.scss';
import TypingInterface from "./TypingInterface/TypingInterface";
import {TypoCommand, TypoText} from "./common/commonTypes";
import PasteField from "./PasteField/PasteField";

enum ApplicationState {
    intro, inPractice, endOfPractice, endOfPracticeeMessage, paused, help, paste,
}

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
            case TypoCommand.skip:
                incrementCursor();
                break;
            case TypoCommand.load:
                fileInput.current?.click();
                break;
            case TypoCommand.resume:
                setCurrentText(practiceText);
                break;
            case TypoCommand.paste:
                setApplicationState(ApplicationState.paste);
                break;
        }
    }

    useEffect(() => {
        const introText = [
            "Type this.",
            "Type :s to skip a character you can't type.",
            "Skip this: Ϫ (:s[enter])",
            "Great! :load and :paste will let you input some text you want to practice with. :help will show you further commands.",
            "You may well start practicing with your own text now. Maybe copy a Wikipedia-article you wanted to read anyways?",
            "Or something you wrote yourself. It is a great way to spellcheck it.",
            "Also when you type the same text over and over you'll start thinking about ways you could improve it.",
            "Go!",
            "Just type :paste, press enter and paste any text you fancy!",
            "It is not that hard :)",
            "I believe in you!",
            "...",
            "Or :load, and you are free to choose any text-file from your file-system.",
            "Only plain text-files though. They usually end with '.txt'.",
            "I know, it's a bummer you can't import PDFs. Maybe I'll implement that some time...",
            "But :paste is a quite neat workaround for that, don't you think?",
            "",
            "Enough talk, go and find yourself a text to practice with!",
            "",
            "",
            "You're still here.",
            "Oooh, I'm sorry, you probably want some kind of hello message!",
            "Here it comes..",
            "",
            "Welcome to Typo, a typing-trainer where you decide, what you want to type!",
            "\"Typo\" is an acronym for \"Your Online Typing Practices\" - and also a great pun.",
            "It is developed with React and Typescript and optimized for Mozilla Firefox.",
            "",
            "Well, that is some boring stuff right there, isn't it?",
            "I'll just redirect you to the main menu. Was nice to meet you!"
        ]
        const pauseText = ["resume"];
        const endOfPracticeText = ["End of practice. Type '/help' to see a list of available commands"];
        const helpText = ["/s: skip a character. /load: open a plain text-file from your machine. /paste: paste some text you'd like to type. You can start commands with either ':' or '/'"];

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

    const decrementCursor = () => {
        if (currentText.charIndex > 0) {
            setCurrentText(({charIndex, lineIndex, lines}) => {
                return {charIndex: charIndex - 1, lineIndex: lineIndex, lines: lines}
            });
        } else if (currentText.lineIndex > 0) {
            setCurrentText(({lines, lineIndex}) => ({
                lineIndex: lineIndex - 1,
                charIndex: currentText.lines[lineIndex - 1].length,
                lines
            }));
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

    const handlePastePlainText = (plainText: string) => {
        const practice = makeTypoTextFromPlainText(plainText)
        setPracticeText(practice)
        setCurrentText(practice)
        setApplicationState(ApplicationState.inPractice)
    }

    const makeTypoTextFromPlainText = (plainText: string): TypoText => initializePractice(plainText.split("\n"))


    return (
        <div className="ty-app">
            <h1 className={"ty-app-title"}>The beginning of Typo<sup><sup>(alpha)</sup></sup></h1>
            <div className={"ty-center"}>{
                (applicationState === ApplicationState.paste
                    && <PasteField handlePlainTextInput={handlePastePlainText}/>)
                || (
                    <TypingInterface
                        text={currentText}
                        handleCommand={handleCommand}
                        incrementCursor={incrementCursor}
                        decrementCursor={decrementCursor}/>)
            }
            </div>
            <input ref={fileInput} type={"file"} hidden onChange={onFileSelection}/>
        </div>
    );
}

export default App;

const initializePractice = (lines: string[]): TypoText => {
    return {lines: lines, lineIndex: 0, charIndex: 0}
}
