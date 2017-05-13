import React, { Component } from 'react';
import './App.css';
import {Settlement} from './Settlement';
const settlementsCtx = require.context('./data/settlements', true, /^(.*\.(json$))[^.]*$/igm);
const settlements = [];
settlementsCtx.keys().forEach((key) => {
    settlements.push({
        name: key.replace(/^[.][/]/, '').replace(/[.]json$/, '').replace('-', ' '),
        data: settlementsCtx(key)
    });
});

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="world-grid-container">
                    <div className="world-grid">
                        {settlements.map((info, i) => <Settlement key={i} {...info}/>)}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
