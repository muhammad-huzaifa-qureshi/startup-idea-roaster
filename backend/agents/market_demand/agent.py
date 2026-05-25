import json
from groq import AsyncGroq
from config import GROQ_API_KEY, GROQ_LLM_MODEL
from agents.market_demand.prompts import (
    MARKET_SYSTEM_PROMPT,
    MARKET_USER_PROMPT,
    MARKET_REFLECT_PROMPT,
)
from constants import REFLECTION_ROUNDS

client = AsyncGroq(api_key=GROQ_API_KEY)


async def run_market_agent(idea: str) -> dict:
    messages = [
        {"role": "system", "content": MARKET_SYSTEM_PROMPT},
        {"role": "user", "content": MARKET_USER_PROMPT.format(idea=idea)},
    ]

    # Initial analysis
    response = await client.chat.completions.create(
        model=GROQ_LLM_MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=600,
    )
    current_output = response.choices[0].message.content.strip()

    # Reflection loop — critique and revise N times
    for i in range(REFLECTION_ROUNDS):
        messages.append({"role": "assistant", "content": current_output})
        messages.append({"role": "user", "content": MARKET_REFLECT_PROMPT})

        response = await client.chat.completions.create(
            model=GROQ_LLM_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=600,
        )
        current_output = response.choices[0].message.content.strip()

    try:
        return json.loads(current_output)
    except json.JSONDecodeError:
        return {"roast": current_output, "summary": "Parse error", "score": 5}
