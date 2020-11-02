import "./PasteInterface.scss"

import React, {useRef} from "react";
import useAlwaysFocusOn from "../common/useAlwaysFocusOn";

type PasteInterfaceProps = {
    handlePlainTextInput: (plainText: string) => void;
}

const PasteInterface = (props: PasteInterfaceProps) => {
    const textArea = useRef<HTMLTextAreaElement>(null)

    useAlwaysFocusOn(textArea)

    return (
        <div className={"ty-paste-field"}>
            <textarea ref={textArea} placeholder={"Paste your Text"} onChange={(e)=>props.handlePlainTextInput(e.target.value)}/>
        </div>
    )

}

export default PasteInterface
