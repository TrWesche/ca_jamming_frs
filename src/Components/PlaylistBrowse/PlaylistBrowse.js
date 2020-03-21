import React from 'react';
import './PlaylistBrowse.css';
import { Playlist } from "../Playlist/Playlist";

export class PlaylistBrowse extends React.Component {
    render() {
        if (this.props.userPlaylists) {
            return (
                <div className="PlaylistBrowse">            
                    {
                        this.props.userPlaylists.map(playlist => 
                            <Playlist playlist={playlist} key={playlist.id} /> )
                    }
                </div> 
            )
        } else {
            return (
                <div className="PlaylistBrowse"> 
                    <h3>Loading...</h3>
                </div> 
            )
        }
    }
}