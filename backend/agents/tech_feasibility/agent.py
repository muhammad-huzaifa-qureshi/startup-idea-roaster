import json
from groq import AsyncGroq
from config import GROQ_API_KEY, GROQ_LLM_MODEL
from agents.tech_feasibility.prompts import TECH_SYSTEM_PROMPT, TECH_USER_PROMPT
from agents.tech_feasibility.tools import tavily_search, TOOL_SCHEMAS

client = AsyncGroq(api_key=GROQ_API_KEY)


async def run_tech_agent(idea: str) -> dict:
    tool_used = False
    messages = [
        {"role": "system", "content": TECH_SYSTEM_PROMPT},
        {"role": "user", "content": TECH_USER_PROMPT.format(idea=idea)},
    ]

    while True:
        response = await client.chat.completions.create(
            model=GROQ_LLM_MODEL,
            messages=messages,
            tools=TOOL_SCHEMAS,
            tool_choice="auto",
            temperature=0.7,
            max_tokens=1024,
        )

        msg = response.choices[0].message

        if not msg.tool_calls:
            break

        tool_used = True
        messages.append(msg)  # assistant message containing tool_calls

        for tc in msg.tool_calls:
            args = json.loads(tc.function.arguments)
            result = await tavily_search(
                query=args["query"], max_results=args.get("max_results", 3)
            )
            
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": result,
                }
            )

    raw = msg.content.strip()
    try:
        parsed = json.loads(raw)
        parsed["tool_used"] = tool_used
        return parsed
    except json.JSONDecodeError:
        return {
            "roast": raw,
            "summary": "Parse error",
            "score": 5,
            "tool_used": tool_used,
        }
