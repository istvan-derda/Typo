import "./PasteField.scss"

import React, {useEffect, useRef} from "react";

type PasteFieldProps = {
    handlePlainTextInput: (plainText: string) => void;
}

const PasteField = (props: PasteFieldProps) => {
    const textArea = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const focusInput = () => textArea.current?.focus();

        const alwaysFocusOnInput = () => {
            focusInput();
            document.addEventListener("click", focusInput);
        }

        const cleanup = () => document.removeEventListener("click", focusInput)

        alwaysFocusOnInput();
        return cleanup;
    }, []);

    return (
        <div className={"ty-paste-field"}>
            <textarea ref={textArea} placeholder={"Paste your Text"} onChange={(e)=>props.handlePlainTextInput(e.target.value)}/>
        </div>
    )

}

export default PasteField
