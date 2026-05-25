import { BackendMode, BACKEND_MODES } from "@/constants";


interface Props {
    mode: BackendMode;
    onChange: (mode: BackendMode) => void;
}
export default function BackendToggle({ mode, onChange }: Props) {
    return (
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1 border border-gray-700">
            {Object.values(BACKEND_MODES).map((m) => (
                <button
                    key={m}
                    onClick={() => onChange(m)}
                    className={`text-xs px-3 py-1.5 rounded font-medium transition ${mode === m
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    {m === BACKEND_MODES.FASTAPI ? "FastAPI" : "N8N"}
                </button>
            ))}
        </div>
    );
}