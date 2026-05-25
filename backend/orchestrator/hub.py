import asyncio
from fastapi import APIRouter
from pydantic import BaseModel, field_validator
from constants import MIN_IDEA_LENGTH, COLLECTION_ROASTS
from database import get_db
from agents.market_demand.agent import run_market_agent
from agents.business_model.agent import run_business_agent
from agents.tech_feasibility.agent import run_tech_agent

router = APIRouter()


class RoastRequest(BaseModel):
    idea: str

    @field_validator("idea")
    @classmethod
    def validate_length(cls, v):
        if len(v.strip()) < MIN_IDEA_LENGTH:
            raise ValueError(f"Idea must be at least {MIN_IDEA_LENGTH} characters")
        return v.strip()


@router.post("/roast")
async def roast_idea(request: RoastRequest):
    # Run all 3 agents in parallel
    print("CALLING ALL 3 AGENTS IN PARALLEL...")
    market_result, business_result, tech_result = await asyncio.gather(
        run_market_agent(request.idea),
        run_business_agent(request.idea),
        run_tech_agent(request.idea),
    )

    print("CALCULATING SCORE...")
    survival_score = _calculate_score(market_result, business_result, tech_result)

    print("BUILDING VERDICT...")
    final_verdict = _build_verdict(
        market_result, business_result, tech_result, survival_score
    )

    result = {
        "idea": request.idea,
        "market_roast": market_result["roast"],
        "business_roast": business_result["roast"],
        "tech_roast": tech_result["roast"],
        "final_verdict": final_verdict,
        "survival_score": survival_score,
        "tool_used_by_agent": tech_result.get("tool_used", False),
    }

    print("WRITING TO DATABASE...")
    # Persist to MongoDB
    db = get_db()
    await db[COLLECTION_ROASTS].insert_one({**result})

    return result


@router.get("/history")
async def get_history(limit: int = 20):
    db = get_db()
    cursor = db[COLLECTION_ROASTS].find({}, {"_id": 0}).sort("_id", -1).limit(limit)

    return await cursor.to_list(length=limit)


def _calculate_score(market, business, tech) -> int:
    # heuristic: each agent returns a score 1-10 or 5 fallback
    scores = [
        market.get("score", 5),
        business.get("score", 5),
        tech.get("score", 5),
    ]

    return round(sum(scores) / len(scores))


def _build_verdict(market, business, tech, score) -> str:
    if score <= 3:
        verdict = "DEAD ON ARRIVAL"
    elif score <= 5:
        verdict = "HIGH RISK - Needs major rethink"
    elif score <= 7:
        verdict = "POSSIBLE - But fix the fundamentals first"
    else:
        verdict = "VIABLE - Still has rough edges though"

    return f"Score: {score}/10\n{verdict}.\nMarket: {market.get('summary', '')}\nBusiness: {business.get('summary', '')}\nTech: {tech.get('summary', '')}"
