"use client";
import { useState, useEffect } from "react";
import { submitRoast, fetchHistory, RoastResult } from "@/lib/api";
import { BackendMode, BACKEND_MODES, MIN_IDEA_LENGTH } from "@/constants";
import { DEFAULT_BACKEND } from "@/config/backend";
import RoastCard from "@/components/RoastCard";
import HistoryPanel from "@/components/HistoryPanel";
import BackendToggle from "@/components/BackendToggle";


export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<BackendMode>(DEFAULT_BACKEND);
  const [history, setHistory] = useState<RoastResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  useEffect(() => {
    fetchHistory(mode).then(setHistory);
  }, [mode, result]);
  const handleSubmit = async () => {
    if (idea.trim().length < MIN_IDEA_LENGTH) {
      setError(`Idea must be at least ${MIN_IDEA_LENGTH} characters.`);
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await submitRoast(idea, mode);
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-red-500">� Startup
              Roaster</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Your idea will be brutally evaluated by 3 AI agents, Don't be scared :)
            </p>
          </div>
          <BackendToggle mode={mode} onChange={setMode} />
        </div>
        <textarea
          className="w-full bg-gray-800 rounded-xl p-4 text-white placeholdergray-500 border border-gray-700 focus:outline-none focus:borderred-500 resize-none text-sm h-32"
          placeholder="Describe your startup idea in detail (min 50 characters)..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">{idea.length} chars</span>
          <button
            onClick={handleSubmit}
            disabled={loading || idea.trim().length < MIN_IDEA_LENGTH}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2 rounded-lg text-sm transition"
          >
            {loading ? "Cooking..." : "Roast My Idea"}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        {loading && (
          <div className="mt-8 text-center text-gray-400 animate-pulse">
            <p>Agents are tearing your idea apart...</p>
          </div>
        )}
        {result && <RoastCard result={result} />}
        <div className="mt-10">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-gray-400 hover:text-white text-sm underline"
          >
            {showHistory ? "Hide History" : "Show History"}
          </button>
          {showHistory && <HistoryPanel items={history} />}
        </div>
      </div>
    </main>
  );
}
