# Startup Idea Roaster
A system where specialized AI roast agents brutally evaluate startup ideas from market demand, business viability, and technical feasibility perspectives. Instead of politely validating ideas, the system intentionally critiques weaknesses, unrealistic assumptions, and hidden risks before the orchestrator delivers a final startup survival verdict.
> Semester Project for Generative AI Course
## Agents Workflow
![Workflow](/images/agents-worflow.jpg)
## Why Multi-Agent Architecture?
A single LLM response often mixes concerns and produces generic feedback.

This system separates evaluation into specialized agents:
- Market realism
- Business sustainability
- Technical feasibility

This creates more focused, adversarial, and explainable critiques.
## Tech Stack
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: FastAPI
- **LLM**: Groq (llama-3.1-8b-instant)
- **Search Tool**: Tavily (used by Tech agent - ReAct pattern)
- **DB**: MongoDB
- **Alternate Workflow**: N8N
## Agent Design Patterns
| Agent | Pattern | Description |
|---|---|---|
| Market Demand | Reflection | Critiques, then reflects before finalizing |
| Business Model | Planning | Step-by-step staged analysis |
| Tech Feasibility | ReAct | Reasons then optionally searches Web |
## Setup
### Backend
```bash
cd backend
python -m venv venv
venv/bin/activate
pip install -r requirements.txt
cp .env.example .env # fill in API keys
uvicorn main:app --reload
```
### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local # fill in URLs
npm run dev
```
## API Endpoints
- `POST /api/roast` — Submit idea, get roast
- `GET /api/history` — Retrieve past roasts
## Backend Mode
Toggle between FastAPI and N8N in the UI or change `DEFAULT_BACKEND` in
`frontend/src/config/backend.ts`.
## Schema
### Request Schema
```json
{
  "idea": "string"
}
```
### Output Schema of All 3 Agents
**Market Demand Agent**
```json
{
  "roast": "string",
  "summary": "string",
  "score": "integer (1-10)"
}
```
**Business Model Agent**
```json
{
  "roast": "string",
  "summary": "string",
  "score": "integer (1-10)"
}
```
**Tech Feasibility Agent**
```json
{
  "roast": "string",
  "summary": "string",
  "score": "integer (1-10)",
  "tool_used": "boolean"
}
```
### Response Schema
```json
{
  "idea": "string",
  "market_roast": "string",
  "business_roast": "string",
  "tech_roast": "string",
  "final_verdict": "string",
  "survival_score": "integer (1-10)",
  "tool_used_by_agent": "boolean"
}
```
### DB Schema
```json
{
  "idea": "string",
  "market_roast": "string",
  "business_roast": "string",
  "tech_roast": "string",
  "final_verdict": "string",
  "survival_score": "integer (1-10)",
  "tool_used_by_agent": "boolean"
}
```
> MongoDB stores the final output as-is; one document per roast request.
## Screenshots
![Initial State](/images/1.jpg)
![Guard Testing](/images/2.jpg)
![Roasts](/images/3.jpg)
![Verdict](/images/4.jpg)
![Mobile view with History](/images/5.jpg)