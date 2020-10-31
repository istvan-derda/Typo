import "./TypingInterface.scss";

import React, {useEffect, useRef, useState} from "react";
import {TypoCommand} from "../common/commonTypes";
import useTypoText from "./useTypoText";
import {introText} from "../resources/texts";

type TypingInterfaceProps = {
    handleCommand: (e: TypoCommand) => void;
}

enum InputState {default, typingError, commandline, validCommand}

const TypingInterface = (props: TypingInterfaceProps) => {
    const [inputState, setInputState] = useState<InputState>(InputState.default);

    const availableCommands: string[] = enumToArray(TypoCommand)
    const typoText = useTypoText(introText)
    const inputField = useRef<HTMLInputElement>(null);

    useAlwaysFocusOn(inputField)

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const inputText = (e.target as HTMLInputElement).value;
        if (inputText === "") {
            setInputState(InputState.default);
            return;
        }

        if (inputText === typoText.nextChar) {
            typoText.moveForward();
            (e.target as HTMLInputElement).value = "";
            setInputState(InputState.default);
        } else if (inputText[0] === "/" || inputText[0] === ":") {
            if (availableCommands.includes(inputText.substr(1))) {
                setInputState(InputState.validCommand);
            } else {
                setInputState(InputState.commandline);
            }
        } else {
            setInputState(InputState.typingError);
        }
    }

    const handleEnter = (e: React.FormEvent<HTMLInputElement>) => {
        const inputText = (e.target as HTMLInputElement).value
        if (inputState === InputState.validCommand) {
            let command = inputText.substr(1) as TypoCommand
            (e.target as HTMLInputElement).value = "";
            setInputState(InputState.default);
            props.handleCommand(command)
        } else if (typoText.nextChar === undefined && inputText === "") {
            typoText.moveForward()
        } else {
            (e.target as HTMLInputElement).value += "⮐";
            setInputState(InputState.typingError);
        }
    }

    return (
        <div className={"ty-typing-interface"}>
            <div className={"ty-typed-text"}>
                <pre>{typoText.typedText.substring(typoText.typedText.length - 60 > 0 ? typoText.typedText.length - 60 : 0, typoText.typedText.length)}</pre>
            </div>
            <div className={"ty-next-char"}>
                <pre><b><u>{typoText.nextChar}</u></b></pre>
            </div>
            <div className={"ty-target-text"}>
                <pre>{typoText.textToType.substr(0, 60)}</pre>
            </div>
            <div className={"ty-typed-text"}>
                <pre>{typoText.typedText.substring(typoText.typedText.length - 60 > 0 ? typoText.typedText.length - 60 : 0, typoText.typedText.length)}</pre>
            </div>
            <input className={`ty-typing-input 
            ${(inputState === InputState.typingError && "--typo")
            || (inputState === InputState.commandline && "--command-line")
            || (inputState === InputState.validCommand && "--valid-command")}`}
                   ref={inputField}
                   type={"text"}
                   onChange={handleChange}
                   onKeyDown={(e) => {
                       if (e.key === "Enter") handleEnter(e);
                       if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") typoText.moveBack();
                   }}
                   placeholder={typoText.nextChar === undefined ? "[Enter]" : ""}/>
        </div>
    )
}

export default TypingInterface;

function enumToArray<T>(type: T): string[] {
    return Object.values(type).slice(0, Object.values(type).length)
}

function useAlwaysFocusOn(inputElement: React.RefObject<HTMLInputElement>) {
    useEffect(() => {
        const focusInput = () => inputElement.current?.focus();

        const alwaysFocusOnInput = () => {
            focusInput();
            document.addEventListener("click", focusInput);
        }

        const cleanup = () => {
            document.removeEventListener("click", focusInput)
        }

        alwaysFocusOnInput();
        return cleanup;
    }, []) // eslint-disable-line
}
