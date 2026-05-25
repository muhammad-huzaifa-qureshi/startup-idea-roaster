import { RoastResult } from "@/lib/api";

const ScoreBar = ({ score }: { score: number }) => {
    const color =
        score <= 3 ? "bg-red-600" : score <= 6 ? "bg-yellow-500" : "bg-green-500";
    return (
        <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Survival Score</span>
                <span className="font-bold text-white">{score}/10</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                    className={`h-3 rounded-full ${color} transition-all duration-700`}
                    style={{ width: `${score * 10}%` }}
                />
            </div>
        </div>
    );
};

export default function RoastCard({ result }: { result: RoastResult }) {
    const agents = [
        { label: "Market Demand", roast: result.market_roast, emoji: "�" },
        { label: "Business Model", roast: result.business_roast, emoji: "�" },
        { label: "Tech Feasibility", roast: result.tech_roast, emoji: "⚙️" },
    ];
    return (
        <div className="mt-8 space-y-4">
            {agents.map((a) => (
                <div key={a.label} className="bg-gray-800 rounded-xl p-5 border bordergray-700">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-red-400 text-sm">
                            {a.emoji} {a.label}
                        </h3>
                        {a.label === "Tech Feasibility" && result.tool_used_by_agent && (
                            <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full">
                                � Web Search Used
                            </span>
                        )}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{a.roast}</p>
                </div>
            ))}
            <div className="bg-gray-900 border border-red-900 rounded-xl p-5">
                <h3 className="font-bold text-white mb-2">⚙️ Final Verdict</h3>
                <p className="text-red-300 text-sm">{result.final_verdict}</p>
                <ScoreBar score={result.survival_score} />
            </div>
        </div>
    );
}
