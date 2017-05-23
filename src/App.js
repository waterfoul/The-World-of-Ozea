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
        const mountains = [];
        for(let i = 1; i <= worldinfo.width; i++) {
            for(let j = 1; j <= worldinfo.height; j++) {
                coords.push(<div className={`icon col-${i} row-${j} hasCard coords`}><div className="card">{i}x{j}</div></div>);
            }
        }
        worldinfo.mountains.forEach((m) => {
            const colDiff = m.to.col - m.from.col;
            const rowDiff = m.to.row - m.from.row;
            const colIncr = colDiff / Math.max(Math.abs(rowDiff), Math.abs(colDiff));
            const rowIncr = rowDiff / Math.max(Math.abs(rowDiff), Math.abs(colDiff));
            let col = m.from.col;
            let row = m.from.row;
            do {
                mountains.push(<div className={`icon col-${Math.floor(col)} row-${Math.floor(row)} hasCard mountain`}><div className="card">{Math.floor(col)}x{Math.floor(row)}</div></div>);
                col += colIncr;
                row += rowIncr;
            } while (col !== m.to.col && row !== m.to.row);
        });
        return (
            <div className="App">
                <div className="world-grid-container">
                    <div className="world-grid">
                        {worldinfo.objects.map((o) => (
                            <div className={`icon col-${o.start.col} row-${o.start.row} col-end-${o.end.col} row-end-${o.end.row} ${o.class}`} />
                        ))}
                        {coords}
                        {mountains}
                        <div className="world-grid-display"/>
                        {settlements.map((info, i) => <Settlement key={i} {...info}/>)}
						<div className={`players col-${worldinfo.players.col} row-${worldinfo.players.row}`} ><div className={`icon`} /></div>
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
