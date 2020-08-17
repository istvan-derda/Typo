import React from 'react';
import './App.scss';
import TypingInterface from "./TypingInterface/TypingInterface";

function App() {
    return (
        <div className="ty-app">
            <h1 className={"ty-app-title"}>The beginning of Typo</h1>
            <div className={"ty-center"}>
                <TypingInterface/>
            </div>
        </div>
    );
}

export default App;
