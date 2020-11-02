import React, {useEffect} from "react";

function useAlwaysFocusOn(inputElement: React.RefObject<HTMLElement>) {
    useEffect(() => {
        function focusInput() {
            inputElement.current?.focus();
        }

        function alwaysFocusOnInput() {
            focusInput();
            document.addEventListener("click", focusInput);
        }

        function cleanup() {
            document.removeEventListener("click", focusInput)
        }

        alwaysFocusOnInput();
        return cleanup;
    }, []) // eslint-disable-line
}

export default useAlwaysFocusOn
