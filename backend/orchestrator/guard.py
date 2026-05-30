from fastapi import HTTPException
from groq import AsyncGroq
from config import GROQ_API_KEY
from constants import GROQ_LLM_MODEL
import json

client = AsyncGroq(api_key=GROQ_API_KEY)


async def guard_check(idea: str) -> None:
    """Raises HTTPException if input is not a valid startup idea."""
    response = await client.chat.completions.create(
        model=GROQ_LLM_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an input validator for a startup idea roaster. "
                    "Determine if the given input is a genuine startup idea worth evaluating.\n\n"
                    "Reject if the input is: random gibberish, offensive content, a single word, "
                    "a question, a greeting, or anything clearly not a startup idea.\n\n"
                    "Output ONLY valid JSON:\n"
                    '{"valid": true/false, "reason": "one-line reason if invalid"}'
                ),
            },
            {
                "role": "user",
                "content": f"Is this a valid startup idea?\n\nINPUT: {idea}",
            },
        ],
        temperature=0.1,
        max_tokens=100,
    )

    raw = response.choices[0].message.content.strip()
    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        return  # if guard itself fails to parse, let it through

    if not result.get("valid", True):
        raise HTTPException(
            status_code=400,
            detail=f"PLEASE ENTER A VALID STARTUP IDEA! {result.get('reason', 'Not a startup idea')}",
        )
