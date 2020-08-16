import "./TypingInterface.scss";

import React, {useState} from "react";

const TypingInterface = () => {
    const [targetText, setTargetText] = useState("isztelt hölgyeim és uraim!");
    const [nextChar, setNextChar] = useState("T")
    const [typedText, setTypedText] = useState("");

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        const char = input.value;
        if (char === nextChar) {
            setTypedText(current => current + char);
            input.value = "";
            setNextChar(targetText[0]);
            setTargetText(current => current.substr(1))
        }
    }


    return (
        <div className={"ty-typing-interface"}>
            <div className={"ty-typed-text"}>{typedText}</div>
            <div className={"ty-next-char"}><b><u>{nextChar}</u></b></div>
            <div className={"ty-target-text"}>{targetText}</div>
            <div className={"ty-typed-text"}>{typedText}</div>
            <input onInput={handleInput} className={"ty-typing-input"} type={"text"}/>
        </div>
    )
}

export default TypingInterface;
