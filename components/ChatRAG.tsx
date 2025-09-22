"use client";
import React, { useState } from "react";
import { API_BASE } from "@/lib/api";

export default function ChatRAG({ publicationId }: { publicationId: number }) {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [ans, setAns] = useState<string | null>(null);

  async function ask() {
    if (!q.trim()) return;
    setBusy(true); setAns(null);
    const res = await fetch(`${API_BASE}/qa/single-doc`, {
      method: "POST",
      headers: { "content-type":"application/json" },
      body: JSON.stringify({ publication_id: publicationId, question: q, k: 6 })
    });
    const j = await res.json();
    setAns(j.answer || "No answer.");
    setBusy(false);
  }

  return (
    <div className="border rounded p-4 space-y-3">
      <div className="font-semibold">Ask about this publication</div>
      <textarea value={q} onChange={e=>setQ(e.target.value)} className="w-full border rounded p-2 h-24" placeholder="Your question…" />
      <button onClick={ask} disabled={busy} className="bg-black text-white px-4 py-2 rounded">
        {busy ? "Thinking…" : "Ask"}
      </button>
      {ans && (
        <div className="border-t pt-3 whitespace-pre-wrap">{ans}</div>
      )}
    </div>
  );
}
