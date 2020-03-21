import React from 'react';
import './PlaylistControl.css';

export class PlaylistControl extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            disablePLName: true,
            underlinePLName: "0px",

            disablePLSave: true,
            showSaveBtn: "hidden",

            createNewPlaylist: false,
            updateTracks: false
        };

        this.handleNewPlaylist=this.handleNewPlaylist.bind(this);
        this.handleNameChange=this.handleNameChange.bind(this);
        this.handlePlaylistSave=this.handlePlaylistSave.bind(this);
    }

    handleNewPlaylist() {
        // console.log("New playlist event.")
        this.setState({
            disablePLName: false,
            underlinePLName: "2px solid #FFF",

            disablePLSave: false,
            showSaveBtn: "visible"
        });
    }

    handlePlaylistSave(event) {
        // console.log("Save button clicked.")
        if(this.state.createNewPlaylist) {
            // TODO
        }

        if(this.state.updateTracks) {
            // TODO
        }
        this.props.onSave(event.target.value);
        this.setState({
            disablePLName: true,
            underlinePLName: "0px",

            disablePLSave: true,
            showSaveBtn: "hidden"
        })
    }

    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }

    render() {
        return (
            <div className="PlaylistControl">
                <div className="PlaylistHeading">
                    <h2>Playlists</h2>
                    <div className="tooltip">
                        <button className="Playlist-add" onClick={this.handleNewPlaylist}> + </button>
                        <span className="ttText-add">Create New Playlist</span>
                    </div>
                </div>
                <div className="TracklistHeading">
                    <input className="Playlist-name" disabled={this.state.disablePLName} onChange={this.handleNameChange} value={this.props.playlistName} style={{borderBottom: this.state.underlinePLName}}/>
                    <div className="tooltip">
                        <button className="Playlist-save" disabled={this.state.disablePLSave} onClick={this.handlePlaylistSave} style={{visibility: this.state.showSaveBtn}}></button>
                        <span className="ttText-save" style={{visibility: this.state.showSaveBtn}}>Save Playlist Changes</span>
                    </div>
                </div>
            </div>
        )
    }
}

// defaultValue={this.props.playlistName} 