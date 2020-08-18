import "./TypingInterface.scss";

import React, {useEffect, useState} from "react";

type TypingInterfaceProps = {
    targetText: string[];
}

const TypingInterface = (props: TypingInterfaceProps) => {
    const [nextToType, setNextToType] = useState("");
    const [nextChar, setNextChar] = useState("")
    const [typedText, setTypedText] = useState("");
    const [inputText, setInputText] = useState("");
    const [lineIndex, setLineIndex] = useState(0);

    useEffect(() => { //init()
        setTypedText("");
        setNextToType(props.targetText[lineIndex]?.substr(1) ?? "nd");
        setNextChar(props.targetText[lineIndex]?.[0] ?? "E");
    }, [props.targetText, lineIndex]);

    useEffect(() => { //onInput()
        if (inputText === nextChar && nextChar !== "") {
            console.log(nextChar)
            setTypedText(current => current + inputText);
            setInputText("");
            setNextChar(nextToType[0]);
            setNextToType(current => current.substr(1));
        }
    }, [inputText]); //eslint-disable-line

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
            <input className={`ty-typing-input ${inputText.length > 0 && "ty-typing-input--typo"}`}
                   type={"text"}
                   onChange={(e) => setInputText((e.target as HTMLInputElement).value)}
                   onKeyDown={(e) => e.key === "Enter" && nextChar === undefined && setLineIndex(current => current + 1)}
                   value={inputText}
                   placeholder={nextChar===undefined ? "[Enter]" : ""}/>
        </div>
    )
}

export default TypingInterface;
