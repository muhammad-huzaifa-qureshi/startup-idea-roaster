import { API_ENDPOINTS, BackendMode, BACKEND_MODES } from "@/constants";


export interface RoastResult {
    idea: string;
    market_roast: string;
    business_roast: string;
    tech_roast: string;
    final_verdict: string;
    survival_score: number;
    tool_used_by_agent: boolean;
}


export async function submitRoast(
    idea: string,
    mode: BackendMode
): Promise<RoastResult> {
    const url =
        mode === BACKEND_MODES.N8N
            ? `${API_ENDPOINTS.N8N}`
            : `${API_ENDPOINTS.FASTAPI}/roast`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Request failed");
    }
    return res.json();
}


export async function fetchHistory(mode: BackendMode): Promise<RoastResult[]> {
    // N8N doesn't expose history
    if (mode === BACKEND_MODES.N8N) return [];
    const res = await fetch(`${API_ENDPOINTS.FASTAPI}/history`);
    if (!res.ok) return [];
    return res.json();
}