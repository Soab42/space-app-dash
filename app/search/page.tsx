"use client";
import React, { useState } from "react";

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

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Global Semantic Search</h1>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border p-2 rounded w-96"
          placeholder="Search concept, organism, condition, finding…"
        />
        <button
          onClick={run}
          disabled={busy}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {busy ? "Searching…" : "Search"}
        </button>
      </div>

      <div className="grid gap-3">
        {hits.map((h, i) => (
          <a
            key={i}
            href={`/publications/${h.publication_id}`}
            className="glass-card block rounded p-3 hover:bg-white/10"
          >
            <div className="flex justify-between text-sm text-gray-300">
              <div>Score: {h.score.toFixed(3)}</div>
              <div>
                {h.year ?? "—"} • {h.organism ?? "—"} • {h.environment ?? "—"}
              </div>
            </div>
            <div className="font-medium mt-1">{h.title}</div>
            <div className="text-xs text-gray-400">Chunk #{h.chunk_id}</div>
            <div className="text-sm mt-2 line-clamp-3">{h.snippet}</div>
          </a>
        ))}
        {!busy && hits.length === 0 && (
          <div className="text-sm text-gray-500">No results yet.</div>
        )}
      </div>
    </div>
  );
}

