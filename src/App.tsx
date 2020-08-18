import React from 'react';
import './App.scss';
import TypingInterface from "./TypingInterface/TypingInterface";

function App() {
    return (
        <div className="ty-app">
            <h1 className={"ty-app-title"}>The beginning of Typo</h1>
            <div className={"ty-center"}>
                <TypingInterface targetText={ ["test text"]/*["Welcome to Typo, a typing-trainer where you decide, what you want to type!", "\"Typo\" is an acronym for \"Your Online Typing Practices\". It is developed with React and Typescript and optimized for Mozilla Firefox."]*/}/>
            </div>
        </div>
    );
}

export default App;
