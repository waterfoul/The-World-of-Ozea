import React from 'react';
import './App.css';
import './Settlement.css';

export const Settlement = ({name, data}) => (
    <span
        className={`row-${data.location.row} col-${data.location.col} ${data.type} settlement hasCard`}
    >
        <div className="card">
                <div className="label">
                    Name
                </div>
                <div className="data">
                    {name}
                </div>
                <div className="label">
                    Alignment
                </div>
                <div className="data">
                    {data.alignment.moral === data.alignment.ethical ?
                        data.alignment.moral :
                        data.alignment.moral + '&nbsp;' + data.alignment.ethical
                    }
                </div>
                <div className="label">
                    Type
                </div>
                <div className="data">
                    {data.type}
                </div>
                <div className="label">
                    Corruption
                </div>
                <div className="data">
                    {data.modifiers.corruption}
                </div>
                <div className="label">
                    Crime
                </div>
                <div className="data">
                    {data.modifiers.crime}
                </div>
                <div className="label">
                    Economy
                </div>
                <div className="data">
                    {data.modifiers.economy}
                </div>
                <div className="label">
                    Law
                </div>
                <div className="data">
                    {data.modifiers.law}
                </div>
                <div className="label">
                    Lore
                </div>
                <div className="data">
                    {data.modifiers.lore}
                </div>
                <div className="label">
                    Society
                </div>
                <div className="data">
                    {data.modifiers.society}
                </div>
                <div className="label">
                    Qualities
                </div>
                <div className="data">
                    {data.qualities.join(', ')}
                </div>
                <div className="label">
                    Danger
                </div>
                <div className="data">
                    {data.danger}
                </div>
                <div className="label">
                    Disadvantages
                </div>
                <div className="data">
                    {data.disadvantages.join(', ')}
                </div>
                <div className="label">
                    Government
                </div>
                <div className="data">
                    {data.government}
                </div>
            </div>
    </span>
);

