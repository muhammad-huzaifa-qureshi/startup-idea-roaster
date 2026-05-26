import json
from groq import AsyncGroq
from config import GROQ_API_KEY
from constants import GROQ_LLM_MODEL
from agents.market_demand.prompts import (
    MARKET_SYSTEM_PROMPT,
    MARKET_USER_PROMPT,
    MARKET_CRITIC_SYSTEM_PROMPT,
    MARKET_CRITIC_PROMPT,
    MARKET_REVISE_PROMPT,
)
from constants import REFLECTION_ROUNDS

client = AsyncGroq(api_key=GROQ_API_KEY)


async def _generate(messages: list) -> str:
    response = await client.chat.completions.create(
        model=GROQ_LLM_MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=600,
    )
    return response.choices[0].message.content.strip()


async def run_market_agent(idea: str) -> dict:
    # Generator: first roast
    print("MARKET AGENT — Generating initial roast...")
    generator_messages = [
        {"role": "system", "content": MARKET_SYSTEM_PROMPT},
        {"role": "user", "content": MARKET_USER_PROMPT.format(idea=idea)},
    ]
    current_output = await _generate(generator_messages)

    # Generator/Critic loop
    for i in range(REFLECTION_ROUNDS):
        # Critic evaluates current output
        print(f"MARKET AGENT — Critic round {i + 1}...")
        critic_messages = [
            {"role": "system", "content": MARKET_CRITIC_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": MARKET_CRITIC_PROMPT.format(current_output=current_output),
            },
        ]
        critique = await _generate(critic_messages)

        # Generator revises based on critique
        print(f"MARKET AGENT — Revising based on critique {i + 1}...")
        generator_messages.append(
            {
                "role": "user",
                "content": MARKET_REVISE_PROMPT.format(
                    current_output=current_output,
                    critique=critique,
                ),
            }
        )
        current_output = await _generate(generator_messages)

    try:
        return json.loads(current_output)
    except json.JSONDecodeError:
        return {"roast": current_output, "summary": "Parse error", "score": 5}
