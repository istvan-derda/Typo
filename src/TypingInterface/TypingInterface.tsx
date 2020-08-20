import "./TypingInterface.scss";

import React, {useEffect, useState} from "react";

type TypingInterfaceProps = {
    targetText: string[];
}

enum InputState {default, typo, commandline, validCommand}

enum Command {"help", "load", "pause", length}

const TypingInterface = (props: TypingInterfaceProps) => {
    const [lineIndex, setLineIndex] = useState(0);
    const [[typedText, nextChar, nextToType], setCurrentLine] = useState<[string, string, string]>(["", "", ""])
    const [inputText, setInputText] = useState("");
    const [inputState, setInputState] = useState<InputState>(InputState.default);

    const endOfPracticeText = "End of practice. Type '/help' to see a list of available commands";
    const availableCommands = Object.values(Command).slice(0, Command.length);

    useEffect(() => { //onNextLine
        setCurrentLine(
            [
                "",
                props.targetText[lineIndex]?.[0] ?? endOfPracticeText[0],
                props.targetText[lineIndex]?.substr(1) ?? endOfPracticeText.substr(1)
            ]);
    }, [lineIndex]); //eslint-disable-line

    useEffect(() => {
        setLineIndex(0);
    }, [props.targetText])

    useEffect(() => { //onInput()
        if (inputText === "") {
            setInputState(InputState.default);
            return;
        }
        if (inputText === nextChar) {
            setCurrentLine(([typed, nextChar, toType]) => [typed + nextChar, toType[0], toType.substr(1)])
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
    }, [inputText]);  //eslint-disable-line

    const handleEnter = () => {
        if (inputState === InputState.validCommand) {
            //Todo: dispatch events
        } else if (nextChar === undefined) {
            setLineIndex(current => current + 1)
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
                <pre>{nextToType.substr(0, 60)}</pre>
            </div>
            <div className={"ty-typed-text"}>
                <pre>{typedText.substring(typedText.length - 60 > 0 ? typedText.length - 60 : 0, typedText.length)}</pre>
            </div>
            <input className={`ty-typing-input 
            ${(inputState === InputState.typo && "--typo")
            || (inputState === InputState.commandline && "--command-line")
            || (inputState === InputState.validCommand && "--valid-command")}`}
                   type={"text"}
                   onChange={(e) => setInputText((e.target as HTMLInputElement).value)}
                   onKeyDown={(e) => e.key === "Enter" && handleEnter()}
                   value={inputText}
                   placeholder={nextChar === undefined ? "[Enter]" : ""}/>
        </div>
    )
}

export default TypingInterface;
