import { clientID } from '../PrivateVars/keys';

let userAccessToken;
let tokenType;
let expiresIn;

export const Spotify = {
    getAccessToken: async function() { 
        const urlAddress = "https://accounts.spotify.com/authorize";
        const response_type = "token";
        const redirect_uri = "http:%2F%2Flocalhost:3000%2F";
        const scope = "playlist-modify-private";

        // Check if userAccessToken exists
        if (userAccessToken) {
            // If userAccessToken exists first check if its still valid, if yes return token
            return userAccessToken;
            // TODO: Otherwise clear userAccessToken values and continue code
        }

        // Create random value for checking proper response from API & initialize stateIn
        let stateOut = Math.floor(Math.random()*999);
        let stateIn = -1;
        
        // Contruct the request url
        const request = `${urlAddress}?client_id=${clientID}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}&state=${stateOut}`;

        // Make request and store the return URL
        window.location.href = request;
        let returnURL = window.location.href;

        // Check for hash, if available update user access variables and return the userAccessToken
        let hashTest = /#/;
        if (hashTest.text(returnURL)) {
            stateIn = returnURL.match(/state=([0-9]*)/);
            console.log(`State Out: ${stateOut} | State In: ${stateIn}`); // ******** DEBUGGING CODE **********

            if (stateIn == stateOut) {
                userAccessToken = returnURL.match(/access_token=([^&]*)/);
                tokenType = returnURL.match(/token_type=([^&]*)/);
                expiresIn = returnURL.match(/expires_in=([^&]*)/);
                console.log(`UAT: ${userAccessToken} | Token Type: ${tokenType} | Expiry Time: ${expiresIn}`); // ******** DEBUGGING CODE **********
                return userAccessToken;
            };

        };

        // If unable to authenticate and return a valid userAccessToken alert the user
        alert("Authentication Failed");

    }


}
