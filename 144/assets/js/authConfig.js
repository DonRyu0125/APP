/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 
 AO information.
1) Application (Client) ID: b8d300b2-00c0-4e9f-8d6b-e00b50496555
2) Tenant ID: cddc1229-ac2a-4b97-b78a-0e5cacb5865c
http://m2ademo.minisisinc.com
   auth: {
        clientId: "b8d300b2-00c0-4e9f-8d6b-e00b50496555",
        authority: "https://login.microsoftonline.com/cddc1229-ac2a-4b97-b78a-0e5cacb5865c",
        redirectUri: "http://m2ademo.minisisinc.com/",
    },

c600e36f-c033-41dc-be6c-46f68a201022

MINISIS info m2ademo site
1) Application (Client) ID: 2d13744c-08d9-4ae9-a2fb-c011279ba62a
2) Tenant ID: c77160df-ec47-44ca-bc84-c0fd08deb16f

   auth: {
        clientId: "2d13744c-08d9-4ae9-a2fb-c011279ba62a",
        authority: "https://login.microsoftonline.com/c77160df-ec47-44ca-bc84-c0fd08deb16f",
        redirectUri: "http://m2ademo.minisisinc.com/AzureLogin.html",
    },


MINISIS info m2auat site
1) Application (Client) ID: fe732bcd-8c2e-4666-9103-00a0daa1a9a1
2) Tenant ID: c77160df-ec47-44ca-bc84-c0fd08deb16f
   auth: {
        clientId: "fe732bcd-8c2e-4666-9103-00a0daa1a9a1",
        authority: "https://login.microsoftonline.com/c77160df-ec47-44ca-bc84-c0fd08deb16f",
        redirectUri: "http://m2ademo.minisisinc.com/AzureLogin.html",
    },

 */
const msalConfig = {
    auth: {
        clientId: "c600e36f-c033-41dc-be6c-46f68a201022",
        authority: "https://login.microsoftonline.com/cddc1229-ac2a-4b97-b78a-0e5cacb5865c",
        redirectUri: "http://m2ademo.minisisinc.com/",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case msal.LogLevel.Error:
                        console.error(message);
                        return;
                    case msal.LogLevel.Info:
                        console.info(message);
                        return;
                    case msal.LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case msal.LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
const loginRequest = {
    scopes: ["User.Read"]
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
const tokenRequest = {
    scopes: ["User.Read", "Mail.Read"],
    forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};