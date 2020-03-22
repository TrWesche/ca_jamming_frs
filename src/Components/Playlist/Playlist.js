import React from 'react';
import './Playlist.css';

export class Playlist extends React.Component {
    constructor(props) {
        super(props);

        this.handlePlaylistSelect=this.handlePlaylistSelect.bind(this);
    }

    handlePlaylistSelect() {
        this.props.playlistSelect(this.props.playlist.tracks.href, this.props.playlist.name);
    }

    render() {
        // console.log(this.props.playlist.images.length);
        // console.log(this.props.playlist.images[0]);
        // console.log(this.props.playlist);
        let imageLink = (this.props.playlist.images.length > 0) ? this.props.playlist.images[(this.props.playlist.images.length -1)].url : "";
        // console.log(imageLink);
        return(
            <div className="Playlist" onClick={this.handlePlaylistSelect}>
                <div className="AlbumArt">
                    <img src={imageLink} alt=""></img>
                </div>
                <div className="PlayList-Info">
                    <h3>{this.props.playlist.name}</h3>
                    <p>Trks. {this.props.playlist.tracks.total}</p>
                </div>
            </div>
        )
    }
}