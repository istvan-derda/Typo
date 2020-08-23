import "./TypingInterface.scss";

import React, {useEffect, useRef, useState} from "react";
import {TypoEvent, TypoText} from "../common/commonTypes";

type TypingInterfaceProps = {
    text: TypoText;
    incrementCursor: () => void;
    handleEvent: (e: TypoEvent) => void;
}

enum InputState {default, typo, commandline, validCommand}

enum TypoCommand {help="help", load="load", pause="pause"}

const TypingInterface = (props: TypingInterfaceProps) => {
    const [inputText, setInputText] = useState("");
    const [inputState, setInputState] = useState<InputState>(InputState.default);

    const availableCommands: string[] = Object.values(TypoCommand).slice(0, 3);
    const {lines, lineIndex, charIndex} = props.text;
    const typedText = lines[lineIndex].substr(0, charIndex);
    const nextChar = lines[lineIndex][charIndex];
    const toType = lines[lineIndex].substr(charIndex + 1, lines[lineIndex].length);

    const inputField = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const focusInput = () => inputField.current?.focus();

        focusInput();
        document.addEventListener("click", focusInput);

        return () => document.removeEventListener("click", focusInput);
    }, []);

    useEffect(() => {
        if (inputText === "") {
            setInputState(InputState.default);
            return;
        }
        if (inputText === nextChar) {
            props.incrementCursor();
            setInputText("");
            setInputState(InputState.default);
        } else if (inputText[0] === "/" || inputText[0] === ":") {
            if (availableCommands.includes(inputText.substr(1))) {
                setInputState(InputState.validCommand);
            } else {
                setInputState(InputState.commandline);
            }
        } else {
            setInputState(InputState.typo);
        }
    }, [inputText]); //eslint-disable-line

    const handleEnter = () => {
        if (inputState === InputState.validCommand) {
            switch (inputText.substr(1) as TypoCommand) {
                case TypoCommand.help:
                    props.handleEvent(TypoEvent.getHelp);
                    break;
                case TypoCommand.load:
                    props.handleEvent(TypoEvent.load);
                    break;
                case TypoCommand.pause:
                    props.handleEvent(TypoEvent.pause);
                    break;
            }
            setInputText("");
        } else if (nextChar === undefined && inputText === "") {
            props.incrementCursor();
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
            ${(inputState === InputState.typo && "--typo")
            || (inputState === InputState.commandline && "--command-line")
            || (inputState === InputState.validCommand && "--valid-command")}`}
                   ref={inputField}
                   type={"text"}
                   onChange={(e) => setInputText((e.target as HTMLInputElement).value)}
                   onKeyDown={(e) => e.key === "Enter" && handleEnter()}
                   value={inputText}
                   placeholder={nextChar === undefined ? "[Enter]" : ""}/>
        </div>
    )
}

export default TypingInterface;
