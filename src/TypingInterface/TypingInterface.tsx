import "./TypingInterface.scss";

import React, {useEffect, useState} from "react";

const TypingInterface = () => {
    const [targetText, setTargetText] = useState("elcome to Typo, a typing-trainer where you decide, what you want to type!");
    const [nextChar, setNextChar] = useState("W")
    const [typedText, setTypedText] = useState("");
    const [inputText, setInputText] = useState("");

    useEffect(() => {
        if (inputText === nextChar) {
            setTypedText(current => current + inputText);
            setInputText("");
            setNextChar(targetText[0]);
            setTargetText(current => current.substr(1));
        }
    }, [inputText, nextChar, targetText])

    return (
        <div className={"ty-typing-interface"}>
            <div className={"ty-typed-text"}>
                <pre>{typedText}</pre>
            </div>
            <div className={"ty-next-char"}>
                <pre><b><u>{nextChar === " " ? "_" : nextChar}</u></b></pre>
            </div>
            <div className={"ty-target-text"}>
                <pre>{targetText}</pre>
            </div>
            <div className={"ty-typed-text"}>
                <pre>{typedText}</pre>
            </div>
            <input className={`ty-typing-input ${inputText.length > 0 && "ty-typing-input--typo"}`}
                   type={"text"}
                   onChange={(e) => setInputText((e.target as HTMLInputElement).value)}
                   value={inputText}/>
        </div>
    )
}

export default TypingInterface;
