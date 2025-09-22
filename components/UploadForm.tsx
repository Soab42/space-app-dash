"use client";
import React, { useState } from "react";
import { API_BASE } from "@/lib/api";

export default function UploadForm() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [resp, setResp] = useState<any>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResp(null);

    const meta = {
      title: (document.getElementById("title") as HTMLInputElement).value,
      abstract:
        (document.getElementById("abstract") as HTMLTextAreaElement).value ||
        null,
      year:
        Number((document.getElementById("year") as HTMLInputElement).value) ||
        null,
      organism:
        (document.getElementById("organism") as HTMLInputElement).value || null,
      environment:
        (document.getElementById("environment") as HTMLInputElement).value ||
        null,
      original_link:
        (document.getElementById("original_link") as HTMLInputElement).value ||
        null,
      tags: ((document.getElementById("tags") as HTMLInputElement).value || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      authors: JSON.parse(
        (document.getElementById("authors") as HTMLTextAreaElement).value ||
          "[]"
      ),
      metadata_json: {},
      text:
        (document.getElementById("text") as HTMLTextAreaElement).value || null,
    };

    const fd = new FormData();
    fd.append("metadata_json", JSON.stringify(meta));
    if (pdf) fd.append("pdf", pdf);

    const res = await fetch(`${API_BASE}/publications`, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) {
      setBusy(false);
      alert(await res.text());
      return;
    }
    setResp(await res.json());
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl glass-card p-6 rounded-lg">
      <input
        id="title"
        placeholder="Title"
        className="w-full p-2 rounded bg-transparent border border-gray-700"
        required
      />
      <textarea
        id="abstract"
        placeholder="Abstract"
        className="w-full p-2 rounded bg-transparent border border-gray-700"
      />
      <div className="grid grid-cols-3 gap-2">
        <input id="year" placeholder="Year" className="p-2 rounded bg-transparent border border-gray-700" />
        <input
          id="organism"
          placeholder="Organism"
          className="p-2 rounded bg-transparent border border-gray-700"
        />
        <input
          id="environment"
          placeholder="Environment"
          className="p-2 rounded bg-transparent border border-gray-700"
        />
      </div>
      <input
        id="original_link"
        placeholder="Original link"
        className="w-full p-2 rounded bg-transparent border border-gray-700"
      />
      <input
        id="tags"
        placeholder="Tags (comma separated)"
        className="w-full p-2 rounded bg-transparent border border-gray-700"
      />
      <textarea
        id="authors"
        placeholder='Authors JSON e.g. [{"name":"A. Smith","affiliation":"JSC","orcid":"0000-...","rank":1}]'
        className="w-full p-2 rounded h-24 bg-transparent border border-gray-700"
      />
      <div className="text-sm text-gray-300">
        Provide either PDF or raw text below.
      </div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdf(e.target.files?.[0] || null)}
        className="w-full p-2 rounded bg-transparent border border-gray-700"
      />
      <textarea
        id="text"
        placeholder="Raw full text (optional if PDF provided)"
        className="w-full p-2 rounded h-40 bg-transparent border border-gray-700"
      />
      <button disabled={busy} className="border border-gray-700 px-4 py-2 rounded hover:bg-white/10">
        {busy ? "Uploading..." : "Upload & Ingest"}
      </button>
      {resp && (
        <pre className="glass-card p-2 rounded overflow-x-auto bg-transparent border border-gray-700">
          {JSON.stringify(resp, null, 2)}
        </pre>
      )}
    </form>
  );
}