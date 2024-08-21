**Azure AD SSO logon info** 

_Files to implement Azure AD SSO logon_
* m2ademo_wwwroot\AzureLogin.html – main logon page
* m2ademo_wwwroot\m2aonline\assets\js\authConfig.js - configuration file holds constants and redirect URL Azure AD application.
* m2ademo_wwwroot\m2aonline\assets\js\authPopup.js – Handles pop up SSO sign on.
* m2ademo_wwwroot\m2aonline\assets\js\authRedirect.js – Handle redirect SSO sign on
* m2ademo_wwwroot\m2aonline\assets\js\graph.js – support file for MS example
* m2ademo_wwwroot\m2aonline\assets\js\graphConfig.js – support file for MS example
* m2ademo_wwwroot\m2aonline\assets\js\ui.js – support file for MS example

_Configuration information for the authConfig.js file_

AO information.
1) Application (Client) ID: b8d300b2-00c0-4e9f-8d6b-e00b50496555
2) Tenant ID: cddc1229-ac2a-4b97-b78a-0e5cacb5865c

```
   auth: {
        clientId: "b8d300b2-00c0-4e9f-8d6b-e00b50496555",
        authority: "https://login.microsoftonline.com/cddc1229-ac2a-4b97-b78a-0e5cacb5865c",
        redirectUri: "https://m2auat.minisisinc.com/",
    },

```

MINISIS info m2ademo site
1) Application (Client) ID: 2d13744c-08d9-4ae9-a2fb-c011279ba62a
2) Tenant ID: c77160df-ec47-44ca-bc84-c0fd08deb16f

```
   auth: {
        clientId: "2d13744c-08d9-4ae9-a2fb-c011279ba62a",
        authority: "https://login.microsoftonline.com/c77160df-ec47-44ca-bc84-c0fd08deb16f",
        redirectUri: "https://m2ademo.minisisinc.com/AzureLogin.html",
    },

```
MINISIS info m2auat site
1) Application (Client) ID: fe732bcd-8c2e-4666-9103-00a0daa1a9a1
2) Tenant ID: c77160df-ec47-44ca-bc84-c0fd08deb16f

```
   auth: {
        clientId: "fe732bcd-8c2e-4666-9103-00a0daa1a9a1",
        authority: "https://login.microsoftonline.com/c77160df-ec47-44ca-bc84-c0fd08deb16f",
        redirectUri: "https://m2auat.minisisinc.com/AzureLogin.html",
    },

```