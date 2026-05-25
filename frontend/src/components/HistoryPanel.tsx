import { RoastResult } from "@/lib/api";


export default function HistoryPanel({ items }: { items: RoastResult[] }) {
    if (!items.length)
        return <p className="text-gray-500 text-sm mt-4">No history yet.</p>;
    return (
        <div className="mt-4 space-y-3">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                    <p className="text-xs text-gray-400 truncate mb-1">{item.idea}</p>
                    <div className="flex items-center gap-3">
                        <span
                            className={`text-xs font-bold px-2 py-1 rounded ${item.survival_score <= 3
                                ? "bg-red-900 text-red-300"
                                : item.survival_score <= 6
                                    ? "bg-yellow-900 text-yellow-300"
                                    : "bg-green-900 text-green-300"
                                }`}
                        >
                            {item.survival_score}/10
                        </span>
                        <span className="text-gray-400 text-xs truncate">{item.final_verdict}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
