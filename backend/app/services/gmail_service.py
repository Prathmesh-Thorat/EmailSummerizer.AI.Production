import json

from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials


SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly"
]


# GLOBAL OAUTH FLOW
flow = Flow.from_client_secrets_file(
    "credentials.json",
    scopes=SCOPES,
    redirect_uri="http://localhost:8000/auth/callback"
)


# GENERATE GOOGLE LOGIN URL
def get_auth_url():

    auth_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
    )

    return auth_url


# PROCESS GOOGLE CALLBACK
def process_callback(code: str):

    flow.fetch_token(code=code)

    credentials = flow.credentials

    gmail_service = build(
        "gmail",
        "v1",
        credentials=credentials
    )

    profile = gmail_service.users().getProfile(
        userId="me"
    ).execute()

    email = profile["emailAddress"]

    return {
        "email": email,
        "credentials": credentials.to_json()
    }


def fetch_emails_from_credentials(
    credentials_json,
    days=1
):

    credentials_data = json.loads(credentials_json)

    credentials = Credentials(
        token=credentials_data["token"],
        refresh_token=credentials_data.get("refresh_token"),
        token_uri=credentials_data["token_uri"],
        client_id=credentials_data["client_id"],
        client_secret=credentials_data["client_secret"],
        scopes=credentials_data["scopes"]
    )

    gmail_service = build(
        "gmail",
        "v1",
        credentials=credentials
    )

    query = f"""
    -category:promotions
    -category:social
    -is:spam
    -unsubscribe
    newer_than:{days}d
    """

    results = gmail_service.users().messages().list(
        userId="me",
        q=query,
        maxResults=100
    ).execute()

    messages = results.get("messages", [])

    email_text = ""

    for msg in messages:

        message = gmail_service.users().messages().get(
            userId="me",
            id=msg["id"]
        ).execute()

        headers = message["payload"]["headers"]

        subject = ""
        sender = ""

        for h in headers:

            if h["name"] == "Subject":
                subject = h["value"]

            if h["name"] == "From":
                sender = h["value"]

        snippet = message.get("snippet", "")

        email_text += f"""
From: {sender}
Subject: {subject}
Body: {snippet}

"""
    
    return email_text