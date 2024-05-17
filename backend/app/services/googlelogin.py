from google.oauth2 import id_token
import google.oauth2.credentials
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
import os
from flask import Flask, redirect, url_for, session, request

client_config = {
    "web": {
        "client_id": os.getenv['CLIENT_ID'],
        "project_id": os.getenv('PROJECT_ID'),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": os.getenv('CLIENT_SECRET'),
        "redirect_uris": [
            "http://localhost:3000",
            "https://tripbuddy-frontend-repx5qxhzq-de.a.run.app/explore"
        ],
        "javascript_origins": [
            "http://localhost:3000",
            "https://tripbuddy-frontend-repx5qxhzq-de.a.run.app"
        ]
    }
}

class GoogleLogin:
    def __init__(self):
        self.flow = Flow.from_client_config(client_config, scopes=['https://www.googleapis.com/auth/drive.metadata.readonly'])
        self.flow.redirect_uri = "/api/v1/user/google_login'"
    
    def login(self):
        authorization_url, state = self.flow.authorization_url(
                access_type='offline',
                include_granted_scopes='true',
                prompt='consent'
            )
        session['state'] = state
        return redirect(authorization_url)

    def callback(self):
        state = session.get('state')
        if not state or (state != request.args.get('state')):
            return redirect(url_for('index'), error='state_mismatch')
        
        self.flow.fetch_token(authorization_response=request.url)
        credentials = self.flow.credentials

        # Consider storing the credentials in a database
        session['credentials'] = self.credentials_to_dict(credentials)
        return redirect(url_for('index'))

    def credentials_to_dict(self, credentials):
        return {
            'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes
        }

    def exchange_code_for_tokens(self, auth_code):
        try:
            idinfo = id_token.verify_oauth2_token(auth_code, Request(), os.getenv('CLIENT_ID'))
            return idinfo
        except (ValueError, id_token.AuthorizationHeaderError) as e:
            return {'error': str(e)}