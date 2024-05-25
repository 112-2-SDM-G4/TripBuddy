from google.oauth2 import id_token
import google.oauth2.credentials
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
import os
from flask import Flask, redirect, url_for, session, request

client_config = {
    "web": {
        "client_id": os.getenv('GOOGLE_OAUTH2_CLIENT_ID'),
        "project_id": os.getenv('PROJECT_ID'),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": os.getenv('CLIENT_SECRET'),
        "redirect_uris": [
            "http://localhost:3000",
            "https://tripbuddy-frontend-repx5qxhzq-de.a.run.app/explore",
            "http://127.0.0.1:5000/api/v1/user/google_login/callback",
            "http://localhost:5000/api/v1/user/google_login/callback"
        ],
        "javascript_origins": [
            "http://localhost:3000",
            "https://tripbuddy-frontend-repx5qxhzq-de.a.run.app"
        ]
    }
}

class GoogleLogin:
    def __init__(self):
        self.flow = Flow.from_client_config(
            client_config,
            scopes=[
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
                "openid",
            ],
        )
        self.flow.redirect_uri = "http://localhost:5000/api/v1/user/google_login/callback" 

    def login(self):
        authorization_url, state = self.flow.authorization_url(
                access_type='offline',
                include_granted_scopes='true',
                prompt='consent'
            )
        session['state'] = state
        return authorization_url

    def callback(self):
        state = session.get('state')
        request_state = request.args.get('state')

        if not state or not request_state or state != request_state:
            return redirect("https://tripbuddy-frontend-repx5qxhzq-de.a.run.app/login")

        session.pop('state', None)

        self.flow.fetch_token(code=self.extract_code(request.url))
        credentials = self.flow.credentials

        id_info = id_token.verify_oauth2_token(
            id_token=credentials.id_token,
            request=Request(),
            audience=os.getenv('CLIENT_ID'),
            clock_skew_in_seconds=0
        )

        if id_info.get('error'):
            return redirect(os.getenv['REDIRECT_URIS'], error=id_info['error'])
        
        user_info ={
            "email": id_info.get('email'),
            "name": id_info.get('name'),
            "picture": id_info.get('picture')
        }

        session['credentials'] = self.credentials_to_dict(credentials)
        return user_info

    def credentials_to_dict(self, credentials):
        return {
            'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes
        }
    
    def extract_code(self, url):
        parsed_url = url.split("?")
        if len(parsed_url) < 2:
            return None

        params = parsed_url[1].split("&")
        for param in params:
            key, value = param.split("=")
            if key   == "code":
                return value
        return None
