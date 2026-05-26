import { RoastResult } from "@/lib/api";

export default function HistoryPanel({ items }: { items: RoastResult[] }) {
    if (!items.length) {
        return (
            <p className="text-gray-500 text-sm mt-6">
                No history yet
            </p>
        );
    }

    return (
        <div className="mt-6 w-full space-y-3">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="w-full max-w-full bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition overflow-hidden"
                >
                    {/* Idea */}
                    <p className="text-xs text-gray-500 mb-2 wrap-break-word">
                        {item.idea}
                    </p>

                    {/* Bottom row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                        <span
                            className={`text-xs font-semibold px-2 py-1 rounded w-fit ${item.survival_score <= 3
                                ? "bg-red-900 text-red-300"
                                : item.survival_score <= 6
                                    ? "bg-yellow-900 text-yellow-300"
                                    : "bg-green-900 text-green-300"
                                }`}
                        >
                            {item.survival_score}/10
                        </span>

                        <span className="text-xs text-gray-400 wrap-break-word whitespace-pre-line">
                            {item.final_verdict}
                        </span>

                    </div>
                </div>
            ))}
        </div>
    );
}