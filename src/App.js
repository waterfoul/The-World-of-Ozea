import React, { Component } from 'react';
import './App.css';
import {Settlement} from './Settlement';
import worldinfo from './data/worldinfo.json';
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
        const coords = [];
        for(let i = 1; i <= worldinfo.width; i++) {
            for(let j = 1; j <= worldinfo.height; j++) {
                coords.push(<div className={`icon col-${i} row-${j} hasCard coords`}><div className="card">{i}x{j}</div></div>);
            }
        }
        return (
            <div className="App">
                <div className="world-grid-container">
                    <div className="world-grid">
                        {coords}
                        {settlements.map((info, i) => <Settlement key={i} {...info}/>)}
                    </div>
                </div>
                <div className="key">
                    <div><span className="settlement thorpe icon">&nbsp;</span>Thorpe</div>
                    <div><span className="settlement hamlet icon">&nbsp;</span>Hamlet</div>
                    <div><span className="settlement village icon">&nbsp;</span>Village</div>
                    <div><span className="settlement small town icon">&nbsp;</span>Small Town</div>
                    <div><span className="settlement large town icon">&nbsp;</span>Large Town</div>
                    <div><span className="settlement small city icon">&nbsp;</span>Small City</div>
                    <div><span className="settlement large city icon">&nbsp;</span>Large City</div>
                    <div><span className="settlement metropolis icon">&nbsp;</span>Metropolis</div>
                </div>
            </div>
        );
    }
}

export default App;
