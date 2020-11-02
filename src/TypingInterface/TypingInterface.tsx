import "./TypingInterface.scss";

import React from "react";
import useTypoText from "./useTypoText";
import {introText} from "../resources/texts";
import TypingInputField from "./TypingInputField/TypingInputField";


const TypingInterface = () => {
    const {
        nextChar,
        moveForward,
        moveBack,
        textToType,
        typedText,
        setText
    } = useTypoText(introText)

    return (
        <div className={"ty-typing-interface"}>
            <div className={"ty-typed-text"}>
                <pre>{typedText.substring(typedText.length - 60 > 0 ? typedText.length - 60 : 0, typedText.length)}</pre>
            </div>
            <div className={"ty-next-char"}>
                <pre><b><u>{nextChar}</u></b></pre>
            </div>
            <div className={"ty-target-text"}>
                <pre>{textToType.substr(0, 60)}</pre>
            </div>
            <div className={"ty-typed-text"}>
                <pre>{typedText.substring(typedText.length - 60 > 0 ? typedText.length - 60 : 0, typedText.length)}</pre>
            </div>
            <TypingInputField
                typoTextForward={moveForward}
                typoTextBack={moveBack}
                typoTextNextChar={nextChar}
            />
        </div>
    )
}

export default TypingInterface;




