import "./TypingInterface.scss";

import React, {useEffect, useRef, useState} from "react";
import {TypoCommand, TypoText} from "../common/commonTypes";

type TypingInterfaceProps = {
    text: TypoText;
    incrementCursor: () => void;
    decrementCursor: () => void;
    handleCommand: (e: TypoCommand) => void;
}

enum InputMode {default, typo, commandline, validCommand}

const TypingInterface = (props: TypingInterfaceProps) => {
    const [inputMode, setInputMode] = useState<InputMode>(InputMode.default);

    const availableCommands: string[] = Object.values(TypoCommand).slice(0, 6);
    const {lines, lineIndex, charIndex} = props.text;
    const typedText = lines[lineIndex].substr(0, charIndex);
    const nextChar = lines[lineIndex][charIndex];
    const toType = lines[lineIndex].substr(charIndex + 1, lines[lineIndex].length);

    const inputField = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const focusInput = () => inputField.current?.focus();

        const alwaysFocusOnInput = () => {
            focusInput();
            document.addEventListener("click", focusInput);
        }

        const cleanup = () => document.removeEventListener("click", focusInput)

        alwaysFocusOnInput();
        return cleanup;
    }, []);

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const inputText = (e.target as HTMLInputElement).value;

        if (inputText === "") {
            setInputMode(InputMode.default);
            return;
        }
        if (inputText === nextChar) {
            props.incrementCursor();
            (e.target as HTMLInputElement).value = "";
            setInputMode(InputMode.default);
        } else if (inputText[0] === "/" || inputText[0] === ":") {
            if (availableCommands.includes(inputText.substr(1))) {
                setInputMode(InputMode.validCommand);
            } else {
                setInputMode(InputMode.commandline);
            }
        } else {
            setInputMode(InputMode.typo);
        }
    }

    const handleEnter = (e: React.FormEvent<HTMLInputElement>) => {
        const inputText = (e.target as HTMLInputElement).value
        if (inputMode === InputMode.validCommand) {
            let command = inputText.substr(1) as TypoCommand
            (e.target as HTMLInputElement).value = "";
            setInputMode(InputMode.default);
            props.handleCommand(command)
        } else if (nextChar === undefined && inputText === "") {
            props.incrementCursor();
        } else {
            (e.target as HTMLInputElement).value += "⮐";
            setInputMode(InputMode.typo);
        }
    }

    return (
        <div className={"ty-typing-interface"}>
            <div className={"ty-typed-text"}>
                <pre>{typedText.substring(typedText.length - 60 > 0 ? typedText.length - 60 : 0, typedText.length)}</pre>
            </div>
            <div className={"ty-next-char"}>
                <pre><b><u>{nextChar}</u></b></pre>
            </div>
            <div className={"ty-target-text"}>
                <pre>{toType.substr(0, 60)}</pre>
            </div>
            <div className={"ty-typed-text"}>
                <pre>{typedText.substring(typedText.length - 60 > 0 ? typedText.length - 60 : 0, typedText.length)}</pre>
            </div>
            <input className={`ty-typing-input 
            ${(inputMode === InputMode.typo && "--typo")
            || (inputMode === InputMode.commandline && "--command-line")
            || (inputMode === InputMode.validCommand && "--valid-command")}`}
                   ref={inputField}
                   type={"text"}
                   onChange={handleChange}
                   onKeyDown={(e) => {
                       if (e.key === "Enter") handleEnter(e);
                       if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") props.decrementCursor();
                   }}
                   placeholder={nextChar === undefined ? "[Enter]" : ""}/>
        </div>
    )
}

export default TypingInterface;
