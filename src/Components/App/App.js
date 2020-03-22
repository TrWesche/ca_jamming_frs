import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { PlaylistControl } from '../PlaylistControl/PlaylistControl';
import { PlaylistBrowse } from '../PlaylistBrowse/PlaylistBrowse';
import { PlaylistTracks } from '../PlaylistTracks/PlaylistTracks';

// import { trackSearchTestData } from './trackSearchTestData';
// import { PlaylistFull } from './playlistTestData';
import Spotify from '../../Util/Spotify';


class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      searchResults : [],
      userPlaylists: [],
      playlist: [],
      playlistName: "",
      playlistURI: "",
      userAccessToken: ""
    };

    this.search=this.search.bind(this);
    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.savePlaylist=this.savePlaylist.bind(this);
    this.getPlaylists=this.getPlaylists.bind(this);
    this.setPlaylistTracks=this.setPlaylistTracks.bind(this);
    // this.handleTestClick=this.handleTestClick.bind(this);
  }

  async getPlaylists(limit, offset) {
    let playlistsRetrieved = await Spotify.getUserPlaylists();
    // console.log("Value stored to playlists Retrieved variable");
    // console.log(playlistsRetrieved);
    this.setState({
      userPlaylists: playlistsRetrieved
    });
    // console.log("Value stored to state variable");
    // console.log(this.state.userPlaylists);
  }

  async setPlaylistTracks(playlistURI="", playlistName = "New Playlist") {
    if(playlistURI === "New Playlist" || playlistURI === "") {
      this.updatePlaylistName(playlistName);
      this.setState({
        playlist: []
      })
    } else {
      let playlistTrkList = await Spotify.getPlaylistTracks(playlistURI);
      // console.log(playlistTrkList);
      let tempTrkList = []
      playlistTrkList.forEach(element => {
        tempTrkList.push(element.track)
      });
      // console.log(tempTrkList);
      this.updatePlaylistName(playlistName);
      this.setState({
        playlist: tempTrkList,
        playlistURI: playlistURI
      })
    }
  }

  async search(searchTerm) {
    // Asynchronous call made to Spotify.search since it returns a Promise and we want to ensure the final value is passed on to the Tracklist
    this.setState({
      searchResults: await Spotify.search(searchTerm)
    });
  }

  addTrack(track) {
    // Check to ensure the current track is not already in the playlist.  If it is, do not add to the list.
    if (this.state.playlist.findIndex(playlistVal => playlistVal.id === track.id) < 0) {
      let tempTrkList = this.state.playlist;
      tempTrkList.push(track);
      this.setState({
        playlist: tempTrkList
      })
    } else {
      alert("Track is already in the playlist.");
    }
  }

  removeTrack(track) {
    let filteredTrkList = this.state.playlist.filter(playlistVal => playlistVal.id !== track.id);
    this.setState({
      playlist: filteredTrkList
    })
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }

  async savePlaylist() {
    const trackURIS = [];
    this.state.playlist.forEach(track => {
      trackURIS.push(track.uri);
    });
    const playlistID = await Spotify.createPlaylist(this.state.playlistName);
    if (playlistID) {
      await Spotify.addPlaylistTrack(trackURIS, playlistID);
    }
    
    // await Spotify.savePlaylist(this.state.playlistName, trackURIS);
    
    alert("Your playlist has been saved!")
    this.setState({
      playlist: [],
      playlistName: "New Playlist"
    });
  }


  // async handleTestClick() {
  //   // this.setState ({
  //   //   userAccessToken: Spotify.getAccessToken()
  //   // })
  //   let returnVal = await Spotify.getUserPlaylists();
  //   console.log(returnVal);
  //   // console.log(Spotify.getUserPlaylists());
  // }

  render () {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <div className="App-login">
            <button className="Button-login" onClick={this.getPlaylists}> Login </button>
          </div>
          <div className="App-funcareas">
            <div className="App-playlist">
              <PlaylistControl playlistName={this.state.playlistName} setPlaylistTracks={this.setPlaylistTracks} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
              <div className="App-playlistbrowser">
                <PlaylistBrowse userPlaylists={this.state.userPlaylists} setPlaylistTracks={this.setPlaylistTracks} />
                <PlaylistTracks playlistTracks={this.state.playlist} onRemove={this.removeTrack} />
              </div>
            </div>
            <div className="App-searcharea">
              <SearchBar onSearch={this.search} />
              <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;


// Storage for removed testing button in case a new need comes up
/* <button onClick={this.handleTestClick}> TEST </button> */