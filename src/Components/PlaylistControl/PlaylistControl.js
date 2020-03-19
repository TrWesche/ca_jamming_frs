import React from 'react';
import './PlaylistControl.css';

export class PlaylistControl extends React.Component {
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
            <div className="PlaylistControl">
                <h2>Playlists</h2>
                <button className="Playlist-action"> + </button>
                <input onChange={this.handleNameChange} value={this.props.playlistName} />
                <button className="Playlist-save" onClick={this.handlePlaylistSave}></button>
            </div>
        )
    }
}

// defaultValue={this.props.playlistName} 