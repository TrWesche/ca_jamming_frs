import { clientID } from '../PrivateVars/keys';

const headers = {
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
        scope:          "playlist-modify-public user-read-private",
        userAccessToken: "",
        expires_in:      0,

        // Request Variables
        stateOut:       -1,
        stateIn:        0,
        token_type:     "",

        // ---------- Variables Search API --------------
        urlAddrSearch:  "https://api.spotify.com/v1/search",
        market: "from_token",

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
                let searchURL = `${this.props.urlAddrSearch}?q=${userQuery}&type=${searchType}&market=${this.props.market}&limit=${limit}`;
                this.props.Authorization = `Bearer ${this.props.userAccessToken}`;
                headers.Authorization = this.props.Authorization;
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
    }

}

export default Spotify











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