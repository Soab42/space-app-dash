import { api } from "@/lib/api";
import Link from "next/link";

type Pub = {
  id: number;
  title: string;
  year?: number;
  organism?: string;
  summary?: string;
  authors: string[];
  tags: string[];
};

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string, category?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.q) {
    params.set("q", searchParams.q);
  }
  if (searchParams.category) {
    params.set("category", searchParams.category);
  }
  const queryString = params.toString();
  const pubs: Pub[] = await api(`/publications${queryString ? `?${queryString}` : ''}`);
  return (
    <div className="p-6 space-y-4">
      <form className="mb-4">
        <input
          name="q"
          placeholder="Search title/abstract…"
          className="glass-card p-2 rounded w-72 lg:w-96  bg-transparent border-gray-700"
        />
        <button className="ml-2 border border-gray-700 px-3 py-2 rounded hover:bg-white/10">Search</button>
      </form>
      <div className="grid gap-4">
        {pubs.map((p) => (
          <Link
            key={p.id}
            href={`/publications/${p.id}`}
            className="glass-card p-4 rounded block hover:bg-white/10 card"
          >
            <div className="text-lg font-semibold">{p.title}</div>
            <div className="text-sm text-gray-300">
              {p.year ?? "—"} • {p.organism ?? "—"}
            </div>
            <div className="text-sm mt-2 line-clamp-2">
              {p.summary || "No summary yet."}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {p.authors.join(", ")}{" "}
              {p.tags.length ? "• " + p.tags.map((t) => `#${t}`).join(" ") : ""}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
