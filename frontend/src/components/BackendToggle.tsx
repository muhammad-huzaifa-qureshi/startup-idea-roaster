import { BackendMode, BACKEND_MODES } from "@/constants/constants";

interface Props {
    mode: BackendMode;
    onChange: (mode: BackendMode) => void;
}

export default function BackendToggle({ mode, onChange }: Props) {
    return (
        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
            {Object.values(BACKEND_MODES).map((m) => (
                <button
                    key={m}
                    onClick={() => onChange(m)}
                    className={`px-4 py-1.5 text-xs font-medium rounded-lg transition ${mode === m
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