import React from 'react';
import './Playlist.css';
import { TrackList } from '../TrackList/TrackList';

export class Playlist extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleNameChange=this.handleNameChange.bind(this);
        this.handlePlaylistSave=this.handlePlaylistSave.bind(this);
    }

    handlePlaylistSave(event) {
        this.props.onSave(event.target.value);
    }

    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }

    render() {
        return (
            <div className="Playlist">
                <input onChange={this.handleNameChange} value={this.props.playlistName} />
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
                <button className="Playlist-save" onClick={this.handlePlaylistSave}>SAVE TO SPOTIFY</button>
            </div>
        )
    }
}

// defaultValue={this.props.playlistName} 