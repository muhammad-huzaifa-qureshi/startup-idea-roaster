import json
from groq import AsyncGroq
from config import GROQ_API_KEY, GROQ_LLM_MODEL
from agents.business_model.prompts import BUSINESS_SYSTEM_PROMPT, BUSINESS_USER_PROMPT

client = AsyncGroq(api_key=GROQ_API_KEY)


async def run_business_agent(idea: str) -> dict:
    response = await client.chat.completions.create(
        model=GROQ_LLM_MODEL,
        messages=[
            {"role": "system", "content": BUSINESS_SYSTEM_PROMPT},
            {"role": "user", "content": BUSINESS_USER_PROMPT.format(idea=idea)},
        ],
        temperature=0.7,
        max_tokens=600,
    )

    raw = response.choices[0].message.content.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"roast": raw, "summary": "Parse error", "score": 5}
