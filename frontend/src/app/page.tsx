"use client";
import { useState, useEffect } from "react";
import { submitRoast, fetchHistory, RoastResult } from "@/lib/api";
import { BackendMode, MIN_IDEA_LENGTH } from "@/constants/constants";
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
    fetchHistory().then(setHistory);
  }, [result]);

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
    <main className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-black text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-red-500 tracking-tight">
              Startup Roaster
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base">
              Your idea gets evaluated by 3 AI agents. No mercy, Just Brutal.
            </p>
            <p className="text-red-500 text-sm md:text-base">
              Our AI Agents can make mistakes!
            </p>
          </div>

          <BackendToggle mode={mode} onChange={setMode} />
        </div>

        {/* Input Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 md:p-6 shadow-lg">
          <textarea
            className="w-full bg-gray-950 rounded-xl p-4 text-white placeholder-gray-500 border border-gray-800 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none text-sm md:text-base h-36"
            placeholder="Describe your startup idea in detail..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
            <span className="text-xs text-gray-500">
              {idea.length} characters (min. char: 50)
            </span>

            <button
              onClick={handleSubmit}
              disabled={loading || idea.trim().length < MIN_IDEA_LENGTH}
              className="bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg text-sm transition"
            >
              {loading ? "Roasting..." : "Roast My Idea"}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-3">{error}</p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10 text-center text-gray-400 animate-pulse">
            All 3 agents are united to destroy your million dollar idea...
          </div>
        )}

        {/* Result */}
        {result && <RoastCard result={result} />}

        {/* History */}
        <div className="mt-12">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-gray-400 hover:text-white text-sm"
          >
            {showHistory ? "Hide History" : "Show History"}
          </button>

          {showHistory && <HistoryPanel items={history} />}
        </div>
      </div>
      
      {/* Copyright */}
      <footer className="sticky bottom-0 mt-16 py-4 text-center text-gray-600 text-xs backdrop-blur-sm">
        © {new Date().getFullYear()} Muhammad Huzaifa Qureshi. All rights reserved.
      </footer>
    </main>
  );
}