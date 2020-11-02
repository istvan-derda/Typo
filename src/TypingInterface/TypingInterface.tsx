import "./TypingInterface.scss";

import React from "react";
import {TypoText} from "../useTypoText";
import TypingInputField from "./TypingInputField/TypingInputField";
import {TypoAppActions} from "../App";

type TypingInterfaceProps = {
    typoText: TypoText;
    typoAppActions: TypoAppActions;
}

const TypingInterface = (props: TypingInterfaceProps) => {
    const {typedText, nextChar, textToType, moveForward, moveBack} = props.typoText

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
                typoAppActions={props.typoAppActions}
            />
        </div>
    )
}

export default TypingInterface;




