"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type Hit = {
  score: number;
  snippet: string;
  publication_id: number;
  title: string;
  chunk_id: number;
  year?: number | string;
  organism?: string;
  environment?: string;
};

export default function Page() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  async function run() {
    if (!q.trim()) return;
    setBusy(true);
    const res = await fetch(
      `${API_BASE}/search/global?q=${encodeURIComponent(q)}&k=12`
    );
    const j = await res.json();
    setHits(j);
    setBusy(false);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      run();
    }
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header Section */}
      <header className="backdrop-blur-xl bg-white/80 shadow-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-light text-slate-900 tracking-tight">
              Global Semantic Search
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Search across all publications using natural language queries to
              find relevant research, concepts, and findings
            </p>

            {/* Search Input */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-32 py-4 rounded-2xl backdrop-blur-xl bg-white/60 border border-white/20 shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 text-lg"
                  placeholder="Search concept, organism, condition, finding…"
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                  <button
                    onClick={run}
                    disabled={busy || !q.trim()}
                    className="px-6 py-2 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-slate-800/25 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                  >
                    {busy ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Searching
                      </span>
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </div>

              {/* Search Stats */}
              {hits.length > 0 && !busy && (
                <div className="mt-4 text-sm text-slate-600 text-center">
                  Found {hits.length} relevant results
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Results Section */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {busy && (
          <div className="flex items-center justify-center py-16">
            <div className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50 p-8">
              <div className="flex items-center gap-3 text-slate-600">
                <svg
                  className="w-6 h-6 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="font-medium">
                  Searching through publications...
                </span>
              </div>
            </div>
          </div>
        )}

        {!busy && hits.length === 0 && q.trim() && (
          <div className="text-center py-16">
            <div className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50 p-12 max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-slate-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                No results found
              </h3>
              <p className="text-slate-600 text-sm">
                Try adjusting your search terms or using different keywords
              </p>
            </div>
          </div>
        )}

        {!busy && hits.length === 0 && !q.trim() && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg
                className="w-20 h-20 text-slate-300 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-xl font-medium text-slate-800 mb-2">
                Start your search
              </h3>
              <p className="text-slate-600">
                Enter keywords or concepts to search across all publications
              </p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!busy && hits.length > 0 && (
          <div className="space-y-4">
            {hits.map((hit, index) => (
              <Link
                key={index}
                href={`/publications/${hit.publication_id}`}
                className="block backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50 p-6 hover:bg-white/80 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* Header with Score and Metadata */}
                  <div className="flex items-center flex-wrap gap-2 justify-between">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 rounded-full bg-slate-100/80 text-slate-700 text-xs font-medium">
                        Relevance: {(hit.score * 100).toFixed(1)}%
                      </div>
                      <div className="px-3 py-1 rounded-full bg-slate-100/80 text-slate-600 text-xs">
                        Chunk #{hit.chunk_id}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                        <span>{hit.year ?? "—"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                        <span>{hit.organism ?? "—"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                        <span>{hit.environment ?? "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-medium text-slate-900 group-hover:text-slate-800 transition-colors duration-200 leading-tight">
                    {hit.title}
                  </h3>

                  {/* Snippet */}
                  <div className="relative">
                    <p className="text-slate-700 leading-relaxed text-sm line-clamp-3">
                      {hit.snippet}
                    </p>
                    <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
