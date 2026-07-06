import json
from backend.app.ai.gemini_client import client
from backend.app.ai.cerebrea_client import c_client
from google.genai import types
from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable

BATCH_SIZE = 20


def _call_gemini(prompt: str) -> str:
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.3,
            response_mime_type="application/json"
        )
    )

    return response.text

def _call_cerebras(prompt: str) -> str:
    response = c_client.chat.completions.create(
        model="gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You always return valid JSON only."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
        response_format={"type": "json_object"}
    )

    return response.choices[0].message.content

def _call_llm(prompt):
    try:
        return _call_gemini(prompt)

    except (ResourceExhausted, ServiceUnavailable):
        print("Gemini quota exceeded or service unavailable. Falling back to Cerebras.")
        return _call_cerebras(prompt)
# ─────────────────────────────────────────────────────────────
# PASS 1 — Overview batch (summary + stats + important emails)
# Called once per 15-email batch.
# ─────────────────────────────────────────────────────────────
def generate_overview_from_batch(batch_email_text: str, range: str) -> dict:
    prompt = f"""You are an email intelligence assistant. Analyze this BATCH of emails from {range} and return ONLY a valid JSON object — no markdown, no backticks, no extra text.

Schema:
{{
  "overall_summary": "string — 2-3 sentence overview of THIS batch's key themes",
  "stats": {{
    "total_emails": number,
    "finance_emails": number,
    "approvals": number,
    "active_follow_ups": number
  }},
  "important_emails": [
    {{
      "one_line_summary": "string",
      "sender": "string — copy exactly from the email",
      "subject": "string — copy exactly from the email",
      "detailed_summary": "string — exactly 2 sentences",
      "priority": "high" | "medium" | "low"
    }}
  ]
}}

Rules:
- IGNORE all promotional, marketing, and advertisement emails. Do not count them.
- total_emails = count of non-promotional emails only
- finance_emails = invoices, payments, budgets, subscriptions (exclude promo pricing)
- approvals = emails requesting or confirming approval/sign-off
- active_follow_ups = emails needing a reply or action
- important_emails = strictly add all emails counted as active follow-up or that are serious or otherwise important this cannot be less that active follow ups
- priority "high" = urgent/time-sensitive, "medium" = needs attention, "low" = FYI
- Copy subject and sender EXACTLY as they appear in the email
- dont rush anything focus on accuracy.

EMAILS:
{batch_email_text}

IF YOU CANNOT SEE ANY EMAILS RETURN THE SAME JSON WITH NULL INSIDE"""

    raw = _call_llm(prompt)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {
            "overall_summary": None,
            "stats": {"total_emails": 0, "finance_emails": 0, "approvals": 0, "active_follow_ups": 0},
            "important_emails": []
        }


# ─────────────────────────────────────────────────────────────
# PASS 2 — Task extraction (all emails at once)
# Called once with the full email corpus.
# ─────────────────────────────────────────────────────────────
def generate_tasks_from_emails(all_email_text: str, existing_task_context: str, range: str) -> dict:
    prompt = f"""You are an email intelligence assistant. Analyze ALL of the following emails from {range} and return ONLY a valid JSON object — no markdown, no backticks, no extra text.

Schema:
{{
  "tasks": [
    {{
      "title": "string",
      "type": "finance | Legal | follow_up | approval | complaint | meeting",
      "priority": "high | medium | low",
      "status": "pending | completed",
      "task_type": "string",
      "task_key": "stable unique identifier"
    }}
  ],
  "all_emails": [
    {{
      "one_line_summary": "string",
      "subject": "string — copy exactly from the email",
      "sender": "string — copy exactly from the email",
      "category": "Finance | Legal | HR | Support | Meeting | Personal | Other | Complaints"
    }}
  ]
}}

EXISTING TASKS:
{existing_task_context}

Task rules:
1. Use CONSISTENT task_key values — same key for the same real-world activity.
2. If a later email indicates a task was completed, return the SAME task_key with status = completed.
3. Never create duplicate tasks for the same activity.
4. Detect: payment completed, issue resolved, meeting done, subscription renewed, etc.
5. Use semantic understanding.
6. payment completed = completed; payment request = pending; approvals waiting = pending.
7. If an email completes a task not in existing tasks, return it with status = completed and ipdate at = created at.
8. Task title shoud be one lined short and detailed.

all_emails rules:
- Include every non-promotional emails you got.
- Copy subject and sender EXACTLY as they appear in the email.
- summray should be one lined short but detailed
- use given catregories only

EMAILS:
{all_email_text}

IF YOU CANNOT SEE ANY EMAILS RETURN THE SAME JSON WITH NULL INSIDE"""

    raw = _call_llm(prompt)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"tasks": [], "all_emails": []}


# ─────────────────────────────────────────────────────────────
# MERGE — Combine batch overviews into one final result dict
# ─────────────────────────────────────────────────────────────
def merge_overview_batches(batch_results: list[dict]) -> dict:
    """Merge multiple batch overview results into a single overview."""
    all_summaries = [b.get("overall_summary") for b in batch_results if b.get("overall_summary")]
    merged_stats = {"total_emails": 0, "finance_emails": 0, "approvals": 0, "active_follow_ups": 0}
    merged_important = []

    for b in batch_results:
        stats = b.get("stats") or {}
        for key in merged_stats:
            merged_stats[key] += stats.get(key, 0)
        merged_important.extend(b.get("important_emails") or [])

    combined_overview = "\n\n".join(all_summaries) if all_summaries else None

    return {
        "overall_summary": combined_overview,
        "stats": merged_stats,
        "important_emails": merged_important,
    }


# ─────────────────────────────────────────────────────────────
# MAIN ENTRY POINT — orchestrates batching
# Called from auth.py (replaces old generate_summary)
# ─────────────────────────────────────────────────────────────
def generate_summary(email_text: str, existing_task_context: str, email_range: str) -> dict:
    """
    1. Split emails into batches of BATCH_SIZE.
    2. Run overview pass (summary/stats/important_emails) on each batch in parallel via threads.
    3. Run task+all_emails pass once on the full corpus.
    4. Merge everything into one result dict.
    """
    from concurrent.futures import ThreadPoolExecutor, as_completed

    # ── Split raw email_text into individual email blocks ──
    # Emails are separated by double newlines with "From:" as the start marker.
    raw_blocks = []
    current = []
    for line in email_text.splitlines():
        if line.startswith("From:") and current:
            raw_blocks.append("\n".join(current))
            current = [line]
        else:
            current.append(line)
    if current:
        raw_blocks.append("\n".join(current))

    # ── Build batches of BATCH_SIZE ──
    batches = [raw_blocks[i:i + BATCH_SIZE] for i in range(0, max(len(raw_blocks), 1), BATCH_SIZE)]
    batch_texts = ["\n\n".join(b) for b in batches if b]

    # ── Pass 1: overview batches (parallel) ──
    batch_results = []
    if batch_texts:
        with ThreadPoolExecutor(max_workers=min(len(batch_texts), 5)) as executor:
            futures = {
                executor.submit(generate_overview_from_batch, bt, email_range): bt
                for bt in batch_texts
            }
            for future in as_completed(futures):
                try:
                    batch_results.append(future.result())
                except Exception:
                    pass  # individual batch failure is non-fatal

    overview = merge_overview_batches(batch_results)

    # ── Pass 2: tasks + all_emails (full corpus, single call) ──
    task_result = generate_tasks_from_emails(email_text, existing_task_context, email_range)

    # ── Combine ──
    return {
        "overall_summary": overview["overall_summary"],
        "stats": overview["stats"],
        "important_emails": overview["important_emails"],
        "tasks": task_result.get("tasks", []),
        "all_emails": task_result.get("all_emails", []),
    }