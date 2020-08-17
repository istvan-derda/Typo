import "./TypingInterface.scss";

import React, {useEffect, useState} from "react";

const TypingInterface = () => {
    const [nextToType, setNextToType] = useState("elcome to Typo, a typing-trainer where you decide, what you want to type! \"Typo\" is an acronym for \"Your Online Typing Practices\". It is developed with React and Typescript and optimized for Mozilla Firefox.");
    const [nextChar, setNextChar] = useState("W")
    const [typedText, setTypedText] = useState("");
    const [inputText, setInputText] = useState("");

    useEffect(() => {
        if (inputText === nextChar && nextChar !== "") {
            console.log(nextChar)
            setTypedText(current => current + inputText);
            setInputText("");
            setNextChar(nextToType[0]);
            setNextToType(current => current.substr(1));
        }
    }, [inputText, nextToType, inputText])

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
                   value={inputText}/>
        </div>
    )
}

export default TypingInterface;
