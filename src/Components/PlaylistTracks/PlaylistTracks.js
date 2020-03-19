import React from 'react';
import './PlaylistTracks.css';
import { TrackList } from '../TrackList/TrackList';

export class PlaylistTracks extends React.Component {

    render() {
        return (
            <div className="PlaylistTracks">
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
            </div>
        )
    }
}