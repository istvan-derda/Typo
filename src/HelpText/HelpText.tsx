import "./HelpText.scss"

import React from "react";
import {helpText} from "../resources/texts";

function HelpText() {
    return <div className={"ty-help-text"}><pre>{helpText}</pre></div>
}

export default HelpText
