import json

from app.ai.groq_client import client


def generate_summary(
    email_text,
    existing_task_context,
    range

):

    prompt = f"""You are an email intelligence assistant. Analyze the following emails from ${range} and return ONLY a valid JSON object — no markdown, no backticks, no extra text.
The JSON must follow this exact schema:
{{
  "overall_summary": "string — 3-4 sentence overview of the ${range} inbox activity and key themes",
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
   "tasks": [
    {{
      "title": "string",
      "type": "finance | Legal | follow_up | approval | complaint | meeting",
      "priority": "high | medium | low",
      "status": "pending | completed"
      "task_type": "payment"
      "task_key": "stable unique identifier",
    }}
  ]
}}

EXISTING TASKS:
{existing_task_context}
Important 
1. Use CONSISTENT task_key values.
2. If a later email indicates a task was completed,
   return the SAME task_key with status = completed.
3. Never create duplicate tasks for same activity.
4. Detect payment completed, issue resolved,
   meeting done, subscription renewed, etc.
5. Use semantic understanding.
 
Rules:
- IGNORE all promotional, marketing, and advertisement emails (e.g. sales offers, newsletters, discount codes, product announcements from brands, subscription upsells). Do not include them in any counts or summaries.
- priority "high" = urgent/time-sensitive, "medium" = needs attention, "low" = FYI
- finance_emails = anything about invoices, payments, budgets, subscriptions (exclude promotional pricing emails)
- approvals = emails requesting or confirming approval/sign-off
- active_follow_ups = emails that need a reply or action
- total_emails = count of non-promotional emails only
- Create tasks only if action is required
- payment completed = completed
- payment request = pending
- approvals waiting = pending
- imporatant emails should content all emails that requires follow up and other imp emails
- task_key must remain SAME across future related emails
- if task is about same payment/request/order then reuse same task_key
- if later email confirms completion then return same task_key with status completed
- if a email complete a task not prensent in exsiting task return the task in tasks with completed status

EMAILS:
{email_text}

IF YOU CANNOT SEE ANY EMAILS RETURN THE SAME JSON WITH NULL INSIDE"""

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

    try:

        data = json.loads(ai_response)

        return data

    except json.JSONDecodeError:

        return {
            "overall_summary": "Failed to generate summary.",
            "stats": {
                "total_emails": 0,
                "finance_emails": 0,
                "approvals": 0,
                "active_follow_ups": 0
            },
            "important_emails": []
        }