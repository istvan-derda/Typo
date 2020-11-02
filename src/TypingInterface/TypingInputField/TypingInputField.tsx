import "./TypingInputField.scss"
import React, {useRef, useState} from "react";
import useAlwaysFocusOn from "../../common/useAlwaysFocusOn";

enum TypingInterfaceCommand { help = "help", load = "load", paste = "paste", skip = "s",}

enum InputState {default, typingError, commandline, validCommand}

type TypingInputFieldProps = {
    typoTextForward: () => void;
    typoTextBack: () => void;
    typoTextNextChar: String;
}


function TypingInputField({typoTextForward, typoTextBack, typoTextNextChar}: TypingInputFieldProps) {
    const [inputState, setInputState] = useState<InputState>(InputState.default);
    const inputField = useRef<HTMLInputElement>(null);

    useAlwaysFocusOn(inputField)

    function handleChange(e: React.FormEvent<HTMLInputElement>) {
        const inputText = (e.target as HTMLInputElement).value;
        if (inputText === "") {
            setInputState(InputState.default);
            return;
        }

        if (inputText === typoTextNextChar) {
            typoTextForward();
            (e.target as HTMLInputElement).value = "";
            setInputState(InputState.default);
        } else if (inputText[0] === "/" || inputText[0] === ":") {
            const availableCommands: string[] = enumToStrings(TypingInterfaceCommand)
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
        } else if (typoTextNextChar === undefined && inputText === "") {
            typoTextForward()
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
                typoTextForward()
                break;
            case TypingInterfaceCommand.paste:
                break;
        }
    }

    return <input className={`ty-typing-input 
            ${(inputState === InputState.typingError && "--typing-error")
    || (inputState === InputState.commandline && "--command-line")
    || (inputState === InputState.validCommand && "--valid-command")}`}
                  ref={inputField}
                  type={"text"}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                      if (e.key === "Enter") handleEnter(e);
                      if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") typoTextBack();
                  }}
                  placeholder={typoTextNextChar === undefined ? "[Enter]" : ""}/>

}

function enumToStrings<T>(type: T): string[] {
    return Object.values(type).slice(0, Object.values(type).length)
}

export default TypingInputField
