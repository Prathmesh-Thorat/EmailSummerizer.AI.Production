import os
import base64
import json
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

from groq import Groq

load_dotenv()

app = FastAPI()

summary_data = {}

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

# OAuth Flow
flow = Flow.from_client_secrets_file(
    "credentials.json",
    scopes=SCOPES,
    redirect_uri="http://localhost:8000/auth/callback"
)

# STEP 1 LOGIN
@app.get("/login")
def login():
    auth_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true"
    )

    return RedirectResponse(auth_url)

# STEP 2 CALLBACK
@app.get("/auth/callback")
def callback(code: str):
    global summary_data

    flow.fetch_token(code=code)

    credentials = flow.credentials

    gmail_service = build(
        "gmail",
        "v1",
        credentials=credentials
    )

    
    query = "-category:promotions -category:social -is:spam -unsubscribe newer_than:7d"

    # Get emails
    results = gmail_service.users().messages().list(
        userId="me",
        q = query,
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

    # GROQ PROMPT
    prompt = f"""You are an email intelligence assistant. Analyze the following emails from the past week and return ONLY a valid JSON object — no markdown, no backticks, no extra text.
 
The JSON must follow this exact schema:
{{
  "overall_summary": "string — 3-4 sentence overview of the week's inbox activity and key themes",
  "stats": {{
    "total_emails": number,
    "finance_emails": number,
    "approvals": number,
    "active_follow_ups": number
  }},
  "important_emails": [
    {{
      "one_line_summary": "string",
      "sender": "string",
      "detailed_summary": "string — exactly 2 sentences",
      "priority": "high" | "medium" | "low"
    }}
  ]
}}
 
Rules:
- IGNORE all promotional, marketing, and advertisement emails (e.g. sales offers, newsletters, discount codes, product announcements from brands, subscription upsells). Do not include them in any counts or summaries.
- priority "high" = urgent/time-sensitive, "medium" = needs attention, "low" = FYI
- finance_emails = anything about invoices, payments, budgets, subscriptions (exclude promotional pricing emails)
- approvals = emails requesting or confirming approval/sign-off
- active_follow_ups = emails that need a reply or action
- total_emails = count of non-promotional emails only
 
EMAILS:
{email_text}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    ai_response = response.choices[0].message.content

    # convert string json to actual json
    data = json.loads(ai_response)
    summary_data = data

    return RedirectResponse(
    "http://localhost:5173/"
)

@app.get("/summary")
def get_summary():
    return summary_data