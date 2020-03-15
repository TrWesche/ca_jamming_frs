import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';

import { trackSearchTestData } from './trackSearchTestData';
import { PlaylistFull } from './playlistTestData';
import { Spotify } from '../../Util/Spotify';


class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      searchResults : trackSearchTestData,
      playlist: PlaylistFull,
      userAccessToken: ""
    };

    this.search=this.search.bind(this);
    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.savePlaylist=this.savePlaylist.bind(this);
    this.handleTestClick=this.handleTestClick.bind(this);
  }

  search(searchTerm) {
    console.log(`Performing serach for ${searchTerm}.`)
  }

  addTrack(track) {
    console.log(`Add Track function triggered with: `);
    console.log(track);
  }

  removeTrack(track) {
    console.log(`Remove Track function triggered with:`);
    console.log(track);
  }

  updatePlaylistName(name) {
    console.log(`Update name function triggered with:`);
    console.log(name);
  }

  savePlaylist() {
    const trackURIS = [];
    // const trackList = this.state.playlist.tracks;
    // console.log(trackList);
    this.state.playlist.tracks.items.forEach(track => {
      trackURIS.push(track.uri);
    })
    console.log(trackURIS);
  }


  handleTestClick() {
    this.setState ({
      userAccessToken: Spotify.getAccessToken()
    })
  }

  render () {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlist.name} playlistTracks={this.state.playlist.tracks.items} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
        <button onClick={this.handleTestClick}> TEST </button>
      </div>
    )
  }
}

export default App;