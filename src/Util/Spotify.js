import { clientID } from '../PrivateVars/keys';

let headers = {
    Authorization: ""
};

const Spotify = {
    props: {
        // ---------- Variables User Access Token --------------
        // Spotify Access Information
        client_id:      clientID,
        urlAddrUAT:     "https://accounts.spotify.com/authorize",
        response_type:  "token",
        redirect_uri:   "http:%2F%2Flocalhost:3000%2F",
        // redirect_uri:   "http:%2F%2Ftw_codecademy_jamming.surge.sh",
        scope:          "playlist-modify-public playlist-read-private user-read-private",
        userAccessToken: "",
        expires_in:      0,

        // User Information
        userID:         "",
        userURI:        "",

        // Request Variables
        stateOut:       -1,
        stateIn:        0,
        token_type:     "",

        // ---------- Variables API --------------
        urlAddrAPI:  "https://api.spotify.com/v1/",

        // ---------- Variables Search API --------------
        market: "from_token",

        // ---------- Variables Playlist API --------------
        playlistList:   [],
        playlistID:     "",
        playlistURI:    "",

        // ---------- Variables Authorization API --------------
        Authorization: ""
    },

    getAccessToken: function() { 
        // Check if userAccessToken exists
        if (this.props.userAccessToken) {
            return this.props.userAccessToken;
        }

        // Check the current URL to see if the variables are present
        let currentURL = window.location.href;
        if (currentURL.search('#')>0) {                                                                         // If the current page URL has a hashcode and the necessary values update the timeout and return the user access token
            this.props.stateIn = currentURL.match(/state=([0-9]*)/)[1];
            this.props.userAccessToken = currentURL.match(/access_token=([^&]*)/)[1];
            this.props.token_type = currentURL.match(/token_type=([^&]*)/)[1];
            this.props.expires_in = currentURL.match(/expires_in=([^&]*)/)[1];

            if (this.props.stateIn && this.props.userAccessToken && this.props.token_type && this.props.expires_in) {
                window.setTimeout(() => this.props.userAccessToken="", this.props.expires_in * 1000);           // Sets the page timeout to expiry time in milliseconds (multipy by 1000)
                window.history.pushState('Access Token', null, '/');                                            // Logs the action into the page history
                return this.props.userAccessToken;
            }
        }

        // If userAccessToken is not saved or available in the URL continue!
        this.props.stateOut = Math.floor(Math.random()*999);                        // Initialize stateOut and stateIn variables to check for a proper API response
                                                                                    // Contruct the request url and redirect to the confirmation site
        window.location = `${this.props.urlAddrUAT}?client_id=${this.props.client_id}&redirect_uri=${this.props.redirect_uri}&scope=${this.props.scope}&response_type=${this.props.response_type}&state=${this.props.stateOut}`;      
    }, 

    search: async function(userQuery, searchType="track", limit=20) {
        // If search attempt without login, call login function
        if (!this.props.userAccessToken) {
            this.getAccessToken();
        } 
        // Otherwise perform the search
        else {
            // Check to make sure the user is passing in some sort of query value.
            if (userQuery) {
                let searchURL = `${this.props.urlAddrAPI}search?q=${userQuery}&type=${searchType}&market=${this.props.market}&limit=${limit}`;
                headers = {
                    Authorization: `Bearer ${this.props.userAccessToken}`
                };
                return await fetch(searchURL, {headers})
                    .then(response => response.json())
                    .then(jsonResponse => {
                        return jsonResponse.tracks.items})
                    .then(jsonResponseArry => {
                        if (jsonResponseArry) {
                            return jsonResponseArry;
                        } else {
                            return {};
                        };
                    });
                }
            }
    },

    getUserPlaylists: async function(limit=20, offset=0) {
        // If when retrieving playlists the user has not logged in, call login function
        if (!this.props.userAccessToken) {
            this.getAccessToken();
        } else {
            // Step 1 = Update the Authorization variable
            headers = {
                Authorization: `Bearer ${this.props.userAccessToken}`
            };
            let queryURL;

            // Step 2= Get user ID
            queryURL = `${this.props.urlAddrAPI}me`;
            await fetch(queryURL, {headers})
            .then(response => response.json())
            .then(jsonResponse => {
                this.props.userID = jsonResponse.id;
                this.props.userURI = jsonResponse.uri})

            if (this.props.userID) {
                queryURL = `${this.props.urlAddrAPI}users/${this.props.userID}/playlists?limit=${limit}&offset=${offset}`;
                return await fetch(queryURL, {
                    method: 'get',
                    headers: {
                        Authorization: `Bearer ${this.props.userAccessToken}`,
                    }
                })
                .then(response => response.json())
                .then(jsonResponse => {
                    return jsonResponse.items;
                })
            } else {
                alert("Unable to resolve userID to retrieve playlists.")
            };
        }      
    },

    createPlaylist: async function(playlistName, playlistPublic=true, collaborative=false, description="Imported from Jammming") {
        // If playlist creation attempt without login, call login function
        if (!this.props.userAccessToken) {
            this.getAccessToken();
        } else {
            // Step 1 = Update the Authorization variable
            headers = {
                Authorization: `Bearer ${this.props.userAccessToken}`
            };
            let queryURL;

            // Step 2= Get user ID
            queryURL = `${this.props.urlAddrAPI}me`;
            await fetch(queryURL, {headers})
            .then(response => response.json())
            .then(jsonResponse => {
                this.props.userID = jsonResponse.id;
                this.props.userURI = jsonResponse.uri})

            if (this.props.userID) {
                // Step 3= Create Playlist
                queryURL = `${this.props.urlAddrAPI}users/${this.props.userID}/playlists`;
                await fetch(queryURL, {
                    method: 'post',
                    headers: {
                        Authorization: `Bearer ${this.props.userAccessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: playlistName,
                        public: playlistPublic,
                        collaborative: collaborative,
                        description: description
                    })
                })
                .then(response => response.json())
                .then(jsonResponse => {
                    console.log(jsonResponse);
                    this.props.playlistID = jsonResponse.id;
                    this.props.playlistURI = jsonResponse.uri;
                    return jsonResponse.id;
                })
            } else {
                alert("Unable to resolve userID to create playlist.")
            };
        }      
    },

    getPlaylistTracks: async function (playlistURI="", limit=100, offset=0) {
        // If when retrieving playlists the user has not logged in, alert them that login is required
        if (!this.props.userAccessToken) {
            alert("Please login to continue")
        } else {
            // Step 1 = Update the Authorization variable
            headers = {
                Authorization: `Bearer ${this.props.userAccessToken}`
            };

            if (playlistURI !== "") {
                let queryURL = `${playlistURI}?limit=${limit}&offset=${offset}`;
                return await fetch(queryURL, {
                    method: 'get',
                    headers: {
                        Authorization: `Bearer ${this.props.userAccessToken}`,
                    }
                })
                .then(response => response.json())
                .then(jsonResponse => {
                    console.log(jsonResponse);
                    return jsonResponse.items;
                })
            } else {
                alert("Playlist URI not available")
            };
        }     
    },

    addPlaylistTrack: async function(tracks=[], playlistID) {
        // If playlist creation attempt without login, call login function
        if (!this.props.userAccessToken) {
            this.getAccessToken();
        } 
        // Otherwise commit tracks to the playlist
        else {
            let uris;
            const maxUris = 100;
            let queryURL = "";

            if (tracks.length > maxUris) {
                let qtyIterations = Math.ceil(tracks.length()/40);
                let trksArrStart = 0;
                let trksArrEnd = 0;
                let processingArray = [];

                for (let i = 0; i < qtyIterations; i++) {
                    trksArrStart = trksArrEnd;
                    trksArrEnd = trksArrEnd + maxUris;
                    if (trksArrEnd > tracks.length) {
                        trksArrEnd = tracks.length;
                    };
                    processingArray = tracks.slice(trksArrStart,trksArrEnd);
                    uris = JSON.stringify(processingArray);
                    queryURL = `${this.props.urlAddrAPI}playlists/${playlistID}/tracks`;
                    await fetch(queryURL, 
                        {
                            method: 'post',
                            headers: {
                                Authorization: `Bearer ${this.props.userAccessToken}`,
                                "Content-Type": "application/json"
                            },
                            body: uris
                        })
                    .then(response => response.json());
                }
            } else {
                uris = JSON.stringify(tracks);
                queryURL = `${this.props.urlAddrAPI}playlists/${playlistID}/tracks`;
                await fetch(queryURL, 
                    {
                        method: 'post',
                        headers: {
                            Authorization: `Bearer ${this.props.userAccessToken}`,
                            "Content-Type": "application/json"
                        },
                        body: uris
                    })
                .then(response => {
                    return response.json()});
            }
            
        }
    }
}

export default Spotify





// savePlaylist: async function(playlistName, tracks, playlistPublic=true, collaborative=false, description="Imported from Jammming") {
//     // If playlist creation attempt without login, call login function
//     if (!this.props.userAccessToken) {
//         this.getAccessToken();
//     } else {
//         // Step 1 = Update the Authorization variable
//         headers = {
//             Authorization: `Bearer ${this.props.userAccessToken}`
//         };
//         let queryURL;

//         // Step 2= Get user ID
//         queryURL = `${this.props.urlAddrAPI}me`;
//         await fetch(queryURL, {headers})
//         .then(response => response.json())
//         .then(jsonResponse => {
//             this.props.userID = jsonResponse.id;
//             this.props.userURI = jsonResponse.uri})

//         if (this.props.userID) {
//             // Step 3= Create Playlist
//             queryURL = `${this.props.urlAddrAPI}users/${this.props.userID}/playlists`;
//             await fetch(queryURL, {
//                 method: 'post',
//                 headers: {
//                     Authorization: `Bearer ${this.props.userAccessToken}`,
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     name: playlistName,
//                     public: playlistPublic,
//                     collaborative: collaborative,
//                     description: description
//                 })
//             })
//             .then(response => response.json())
//             .then(jsonResponse => {
//                 console.log(jsonResponse);
//                 this.props.playlistID = jsonResponse.id;
//                 this.props.playlistURI = jsonResponse.uri;
//             })
//         } else {
//             alert("Unable to resolve userID.")
//         };


//         // Step 4= Add Tracks to Playlist
//         if (this.props.playlistID) {
//             this.addPlaylistTrack(tracks, this.props.playlistID);
//         } else {
//             alert("Unable to resolve playlistID")
//         }
//     }            
// },







// ===================== I believe something along these lines will need to be handled from the APP =================
// Check return for hash, if available update user access variables and return the userAccessToken
// if (currentURL.search('#')>0) {
//     stateIn = currentURL.match(/state=([0-9]*)/)[1];

//     if (stateIn === stateOut.toString()) {
//         userAccessToken = currentURL.match(/access_token=([^&]*)/)[1];
//         tokenType = currentURL.match(/token_type=([^&]*)/)[1];
//         expiresIn = currentURL.match(/expires_in=([^&]*)/)[1];
        
//         window.setTimeout(() => userAccessToken="", expiresIn * 1000);     //Sets a window timeout which will automatically reset the webpage in expiryTime converted to milliseconds
//         console.log(`UAT: ${userAccessToken} | Token Type: ${tokenType} | Expiry Time: ${expiresIn}`); // ******** DEBUGGING CODE **********
//         return userAccessToken;
//     };

// };

// // If unable to authenticate and return a valid userAccessToken alert the user
// alert("Authentication Failed");