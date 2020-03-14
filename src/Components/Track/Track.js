import React from 'react';
import './Track.css';

export class Track extends React.Component {
    renderAction (isRemoval) {
        if (isRemoval) {
            return "-"
        } else {
            return "+"
        }
    }

    render () {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artists[0].name} | {this.props.track.album.name} </p>
                </div>
                <button className="Track-action"> {this.renderAction()} </button>
            </div>
        )
    }
}