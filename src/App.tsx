import React, {useRef, useState} from 'react';
import './App.scss';
import TypingInterface from "./TypingInterface/TypingInterface";
import PasteInterface from "./PasteField/PasteInterface";
import useTypoText from "./useTypoText";
import {introText} from "./resources/texts";
import HelpText from "./HelpText/HelpText";

enum UiInterfaces { typingInterface, pasteInterface,}

export type TypoAppActions = {
    pasteText: () => void;
    loadText: () => void;
    toggleHelp: () => void;
    setThemeToSepia: () => void;
    setThemeToDefault: () => void;
}

enum TypoTheme { white, sepia}

function App() {
    const typoText = useTypoText(introText)
    const [interfaceToDisplay, setInterfaceToDisplay] = useState<UiInterfaces>(UiInterfaces.typingInterface)
    const [displayHelp, setDisplayHelp] = useState(false)
    const [theme, setTheme] = useState(TypoTheme.white)
    const fileInput = useRef<HTMLInputElement>(null)

    const typoAppActions: TypoAppActions = {
        toggleHelp: () => setDisplayHelp(prev => !prev),
        loadText: () => fileInput.current?.click(),
        pasteText: () => setInterfaceToDisplay(UiInterfaces.pasteInterface),
        setThemeToDefault: () => setTheme(TypoTheme.white),
        setThemeToSepia: () => setTheme(TypoTheme.sepia)
    }

    function onFileSelection(e: React.FormEvent<HTMLInputElement>) {
        const inputElement = (e.target as HTMLInputElement);
        let file = inputElement.files?.[0];
        if (file !== undefined) {
            let fileReader = new FileReader();
            fileReader.readAsText(file)
            fileReader.onload = () => {
                const lines = (typeof fileReader.result === "string" ? fileReader.result : "").split("\n")
                typoText.setText(lines)
            }
            fileReader.onerror = () => console.error(fileReader.error);
        }
    }

    function handlePastePlainText(plainText: string) {
        const practice = plainText.split("\n")
        typoText.setText(practice)
        setInterfaceToDisplay(UiInterfaces.typingInterface)
    }


    return (
        <div className={`ty-app ${theme === TypoTheme.sepia && "--sepia"}`}>
            <h1 className={"ty-app-title"}>The beginning of Typo<sup><sup>(alpha)</sup></sup></h1>
            <div className={"ty-center"}>{
                (interfaceToDisplay === UiInterfaces.pasteInterface
                    && <PasteInterface handlePlainTextInput={handlePastePlainText}/>)
                ||
                <TypingInterface typoAppActions={typoAppActions} typoText={typoText}/>
            }
            </div>
            <div className={"ty-bottom"}>
                <div className={"ty-bottom-right"}>{displayHelp && <HelpText/>}</div>
            </div>
            <input ref={fileInput} type={"file"} hidden onChange={onFileSelection}/>
        </div>
    );
}

export default App;
