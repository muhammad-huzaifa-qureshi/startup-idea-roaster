# Startup Idea Roaster
A system where specialized AI roast agents brutally evaluate startup ideas from market demand, business viability, and technical feasibility perspectives. Instead of politely validating ideas, the system intentionally critiques weaknesses, unrealistic assumptions, and hidden risks before the orchestrator delivers a final startup survival verdict.
> Semester Project for Generative AI Course
## Agents Workflow
![Workflow](/agents-worflow.jpg)
## Why Multi-Agent Architecture?

A single LLM response often mixes concerns and produces generic feedback.

This system separates evaluation into specialized agents:
- Market realism
- Business sustainability
- Technical feasibility

This creates more focused, adversarial, and explainable critiques.
## Tech Stack
- **Frontend**: Next.js + Tailwind CSS
- **Backend**: FastAPI + Motor (async MongoDB)
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


TODO
- DB Schema
- OUTPUT Schema of all agents, final output
- input Schema
- screenshots