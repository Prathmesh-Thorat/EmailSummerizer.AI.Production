import os
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

flow = Flow.from_client_secrets_file(
    "credentials.json",
    scopes=SCOPES,
    redirect_uri="http://localhost:8000/auth/callback"
)

def get_auth_url():

    auth_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true"
    )

    return auth_url

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

    query = "-category:promotions -category:social -is:spam -unsubscribe newer_than:7d"

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
        
    return {
    "email_text": email_text,
    "email": email
}