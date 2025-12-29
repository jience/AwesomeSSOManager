import time
import uuid

# In-memory data store
# In a real application, this would be a database.

PROVIDERS = {
    "1": {
        "id": "1",
        "name": "Google Workspace",
        "type": "OIDC",
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
        "isEnabled": True,
        "description": "Sign in with your Google account.",
        "config": {
            "clientId": "google-client-id",
            "clientSecret": "google-client-secret",
            "authorizationUrl": "https://accounts.google.com/o/oauth2/v2/auth",
            "tokenUrl": "https://oauth2.googleapis.com/token",
            "issuer": "https://accounts.google.com",
            "scopes": "openid profile email"
        },
        "createdAt": int(time.time())
    },
    "2": {
        "id": "2",
        "name": "GitHub",
        "type": "OAUTH2",
        "logo": "https://docs.github.com/assets/cb-345/images/site/favicon.png",
        "isEnabled": True,
        "description": "Sign in with your GitHub account.",
        "config": {
            "clientId": "github-client-id",
            "clientSecret": "github-client-secret",
            "authorizationUrl": "https://github.com/login/oauth/authorize",
            "tokenUrl": "https://github.com/login/oauth/access_token",
            "userInfoUrl": "https://api.github.com/user",
            "scopes": "user:email"
        },
        "createdAt": int(time.time())
    },
    "3": {
        "id": "3",
        "name": "Okta",
        "type": "SAML2",
        "logo": "https://picsum.photos/id/3/200/200",
        "isEnabled": False,
        "description": "Sign in with your Okta account.",
        "config": {
            "entryPoint": "https://dev-12345.okta.com/app/generic-saml/sso/saml",
            "issuer": "http://www.okta.com/exkabcdefg12345",
            "cert": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
        },
        "createdAt": int(time.time())
    },
    "4": {
        "id": "4",
        "name": "Legacy CAS",
        "type": "CAS",
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
        "isEnabled": False,
        "description": "Sign in with your Legacy CAS account.",
        "config": {
            "serverUrl": "https://cas.example.com",
            "serviceUrl": "https://app.example.com/login/cas",
            "version": "3.0"
        },
        "createdAt": int(time.time())
    }
}

USERS = {
    "admin": {
        "id": "user-1",
        "username": "admin",
        "password": "admin", # In a real app, use hashed passwords!
        "email": "admin@example.com",
        "role": "admin"
    }
}
