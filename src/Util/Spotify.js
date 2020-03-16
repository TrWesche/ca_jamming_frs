import { clientID } from '../PrivateVars/keys';

let userAccessToken;
let expiresIn;

const Spotify = {
    props: {
        // Spotify Access Information - Authorization
        client_id:      clientID,
        urlAddress:     "https://accounts.spotify.com/authorize",
        response_type:  "token",
        redirect_uri:   "http:%2F%2Flocalhost:3000%2F",
        scope:          "playlist-modify-public",

        // Request Variables
        stateOut:       -1,
        stateIn:        0,
        token_type:     "",
    },

    getAccessToken: function() { 
        // Check the current URL to see if the variables are present
        let currentURL = window.location.href;
        if (currentURL.search('#')>0) {                                             // If the current page URL has a hashcode and the necessary values update the timeout and return the user access token
            this.props.stateIn = currentURL.match(/state=([0-9]*)/)[1];
            userAccessToken = currentURL.match(/access_token=([^&]*)/)[1];
            this.props.token_type = currentURL.match(/token_type=([^&]*)/)[1];
            expiresIn = currentURL.match(/expires_in=([^&]*)/)[1];

            if (this.props.stateIn && userAccessToken && this.props.token_type && expiresIn) {
                window.setTimeout(() => userAccessToken="", expiresIn * 1000);      // Sets the page timeout to expiry time in milliseconds (multipy by 1000)
                window.history.pushState('Access Token', null, '/');                // Logs the action into the page history
                return userAccessToken;
            }
        }

        // If userAccessToken is not saved or available in the URL continue!
        this.props.stateOut = Math.floor(Math.random()*999);                        // Initialize stateOut and stateIn variables to check for a proper API response
                                                                                    // Contruct the request url and redirect to the confirmation site
        window.location = `${this.props.urlAddress}?client_id=${this.props.client_id}&redirect_uri=${this.props.redirect_uri}&scope=${this.props.scope}&response_type=${this.props.response_type}&state=${this.props.stateOut}`;      
    }
}

export default Spotify


        // Check if userAccessToken exists -- Commented out, see comment below
        // ======= WHY? The variable userAccessToken gets reset every time you call this.  This will never run???? =========
        // if (userAccessToken) {
        //     return userAccessToken;
        // }








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