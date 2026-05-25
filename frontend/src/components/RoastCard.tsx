import { RoastResult } from "@/lib/api";

const ScoreBar = ({ score }: { score: number }) => {
    const color =
        score <= 3 ? "bg-red-500" : score <= 6 ? "bg-yellow-500" : "bg-green-500";

    return (
        <div className="mt-5">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Survival Score</span>
                <span className="text-white font-semibold">{score}/10</span>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-3 ${color} transition-all duration-700`}
                    style={{ width: `${score * 10}%` }}
                />
            </div>
        </div>
    );
};

export default function RoastCard({ result }: { result: RoastResult }) {
    const agents = [
        { label: "Market Demand", roast: result.market_roast },
        { label: "Business Model", roast: result.business_roast },
        { label: "Tech Feasibility", roast: result.tech_roast },
    ];

    return (
        <div className="mt-10 space-y-5">

            {agents.map((a) => (
                <div
                    key={a.label}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-red-400">
                            {a.label}
                        </h3>

                        {a.label === "Tech Feasibility" && result.tool_used_by_agent && (
                            <span className="text-[10px] bg-blue-900 text-blue-300 px-2 py-1 rounded-full">
                                Web Search Used
                            </span>
                        )}
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed">
                        {a.roast}
                    </p>
                </div>
            ))}

            <div className="bg-linear-to-r from-gray-900 to-black border border-red-900 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-2">Final Verdict</h3>
                <p className="text-red-300 text-sm leading-relaxed whitespace-pre-line">
                    {result.final_verdict}
                </p>

                <ScoreBar score={result.survival_score} />
            </div>
        </div>
    );
}