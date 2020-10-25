import React, { useRef, useState} from 'react';
import './App.scss';
import TypingInterface from "./TypingInterface/TypingInterface";
import {TypoCommand} from "./common/commonTypes";
import PasteField from "./PasteField/PasteField";
import {TypoTextState} from "./TypingInterface/useTypoText";

enum ApplicationState {
    intro, inPractice, endOfPractice, endOfPracticeeMessage, paused, help, paste,
}

function App() {
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
            case TypoCommand.paste:
                setApplicationState(ApplicationState.paste);
                break;
        }
    }

    const onFileSelection = (e: React.FormEvent<HTMLInputElement>) => {
        const inputElement = (e.target as HTMLInputElement);
        let file = inputElement.files?.[0];
        if (file !== undefined) {
            let fileReader = new FileReader();
            fileReader.readAsText(file)
            fileReader.onload = () => {
                //const practice = makeTypoTextFromPlainText(typeof fileReader.result === "string" ? fileReader.result : "")
                //setPracticeText(practice)
                //setCurrentText(practice)
            }
            fileReader.onerror = () => console.error(fileReader.error);
        }
    }

    const handlePastePlainText = (plainText: string) => {
        //const practice = makeTypoTextFromPlainText(plainText)
        //setPracticeText(practice)
        //setCurrentText(practice)
        setApplicationState(ApplicationState.inPractice)
    }


    const makeTypoTextFromPlainText = (plainText: string): TypoTextState => initializePractice(plainText.split("\n"))


    return (
        <div className="ty-app">
            <h1 className={"ty-app-title"}>The beginning of Typo<sup><sup>(alpha)</sup></sup></h1>
            <div className={"ty-center"}>{
                (applicationState === ApplicationState.paste
                    && <PasteField handlePlainTextInput={handlePastePlainText}/>)
                || <TypingInterface handleCommand={handleCommand}/>
            }
            </div>
            <input ref={fileInput} type={"file"} hidden onChange={onFileSelection}/>
        </div>
    );
}

export default App;

const initializePractice = (lines: string[]): TypoTextState => {
    return {lines: lines, lineIndex: 0, charIndex: 0}
}
