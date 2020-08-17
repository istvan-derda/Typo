import "./TypingInterface.scss";

import React, {useEffect, useState} from "react";

const TypingInterface = () => {
    const [targetText, setTargetText] = useState("isztelt hölgyeim és uraim!");
    const [nextChar, setNextChar] = useState("T")
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
            <pre className={"ty-typed-text"}>{typedText}</pre>
            <pre className={"ty-next-char"}><b><u>{nextChar === " " ? "_" : nextChar}</u></b></pre>
            <pre className={"ty-target-text"}>{targetText}</pre>
            <pre className={"ty-typed-text"}>{typedText}</pre>
            <input className={`ty-typing-input ${inputText.length > 0 && "ty-typing-input--typo"}`}
                   type={"text"}
                   onChange={(e) => setInputText((e.target as HTMLInputElement).value)}
                   value={inputText}/>
        </div>
    )
}

export default TypingInterface;
