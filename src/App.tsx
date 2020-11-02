import React, {useRef, useState} from 'react';
import './App.scss';
import TypingInterface from "./TypingInterface/TypingInterface";
import PasteInterface from "./PasteField/PasteInterface";
import useTypoText from "./useTypoText";
import {introText} from "./resources/texts";

enum UiInterfaces { typingInterface, pasteInterface,}

export type TypoAppActions = {
    pasteText: () => void;
    loadText: () => void;
    displayHelp: () => void;
}

function App() {
    const typoText = useTypoText(introText)
    const [interfaceToDisplay, setInterfaceToDisplay] = useState<UiInterfaces>(UiInterfaces.typingInterface);
    const fileInput = useRef<HTMLInputElement>(null);

    function pasteText() {
        setInterfaceToDisplay(UiInterfaces.pasteInterface)

    }

    function loadTextFromFile() {
        fileInput.current?.click()
    }

    function displayHelp() {

    }

    const typoAppActions: TypoAppActions = {displayHelp: displayHelp, loadText: loadTextFromFile, pasteText: pasteText}

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
        <div className="ty-app --sepia">
            <h1 className={"ty-app-title"}>The beginning of Typo<sup><sup>(alpha)</sup></sup></h1>
            <div className={"ty-center"}>{
                (interfaceToDisplay === UiInterfaces.pasteInterface
                    && <PasteInterface handlePlainTextInput={handlePastePlainText}/>)
                ||
                <TypingInterface typoAppActions={typoAppActions} typoText={typoText}/>
            }
            </div>
            <div className={"ty-bottom"}>
                <pre>Help:</pre>
            </div>
            <input ref={fileInput} type={"file"} hidden onChange={onFileSelection}/>
        </div>
    );
}

export default App;
