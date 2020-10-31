import "./TypingInterface.scss";

import React, {useEffect, useRef, useState} from "react";
import useTypoText from "./useTypoText";
import {introText} from "../resources/texts";

enum TypingInterfaceCommand {
    help = "help: lists all available commands",
    load = "load: open a file from your machine",
    paste = "paste: lets you paste text from your clipboard",
    skip = "s: skip the next character",
}

enum InputState {default, typingError, commandline, validCommand}

const TypingInterface = () => {
    const [inputState, setInputState] = useState<InputState>(InputState.default);
    const typoText = useTypoText(introText)
    const inputField = useRef<HTMLInputElement>(null);

    useAlwaysFocusOn(inputField)

    function handleChange(e: React.FormEvent<HTMLInputElement>) {
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
            const availableCommands: string[] = enumToStrings(TypingInterfaceCommand)
                .map(value => value.split(":")[0])
            if (availableCommands.includes(inputText.substr(1))) {
                setInputState(InputState.validCommand);
            } else {
                setInputState(InputState.commandline);
            }
        } else {
            setInputState(InputState.typingError);
        }
    }

    function handleEnter(e: React.FormEvent<HTMLInputElement>) {
        const inputText = (e.target as HTMLInputElement).value
        if (inputState === InputState.validCommand) {
            let command = inputText.substr(1) as TypingInterfaceCommand
            (e.target as HTMLInputElement).value = "";
            setInputState(InputState.default);
            handleCommand(command)
        } else if (typoText.nextChar === undefined && inputText === "") {
            typoText.moveForward()
        } else {
            (e.target as HTMLInputElement).value += "⮐";
            setInputState(InputState.typingError);
        }
    }

    function handleCommand(command: TypingInterfaceCommand) {
        switch (command) {
            case TypingInterfaceCommand.help:
                break;
            case TypingInterfaceCommand.load:
                break;
            case TypingInterfaceCommand.skip:
                typoText.moveForward()
                break;
            case TypingInterfaceCommand.paste:
                break;
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

function enumToStrings<T>(type: T): string[] {
    return Object.values(type).slice(0, Object.values(type).length)
}

function useAlwaysFocusOn(inputElement: React.RefObject<HTMLInputElement>) {
    useEffect(() => {
        function focusInput() {
            inputElement.current?.focus();
        }

        function alwaysFocusOnInput() {
            focusInput();
            document.addEventListener("click", focusInput);
        }

        function cleanup() {
            document.removeEventListener("click", focusInput)
        }

        alwaysFocusOnInput();
        return cleanup;
    }, []) // eslint-disable-line
}
