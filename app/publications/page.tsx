import { api } from "@/lib/api";
import Link from "next/link";
import CollapsibleHeader from "./CollapsibleHeader";

// Optional: if you're using Next 13+/14 App Router, this page can be a Server Component.
// If you need client-side interactivity beyond the form submit, add "use client" and refactor accordingly.

// --- Types ---
export type Pub = {
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
  searchParams: { q?: string; category?: string; subCategory?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.subCategory)
    params.set("subCategory", searchParams.subCategory);
  const queryString = params.toString();
  const pubs: Pub[] = await api(
    `/publications${queryString ? `?${queryString}` : ""}`
  );

  const q = searchParams.q ?? "";
  const category = searchParams.category ?? "";
  const subCategory = searchParams.subCategory ?? "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      {/* Header */}
      <CollapsibleHeader
        q={q}
        category={category}
        subCategory={subCategory}
        resultsCount={pubs.length}
      />

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Empty state */}
        {pubs.length === 0 && (
          <div className="text-center py-24">
            <div className="mx-auto max-w-md backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl p-10 shadow-xl shadow-slate-200/60">
              <svg
                className="w-12 h-12 text-slate-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-slate-900">
                No publications found
              </h3>
              <p className="text-slate-600 mt-2">
                Try different keywords or remove some filters.
              </p>
            </div>
          </div>
        )}

        {/* Results grid */}
        {pubs.length > 0 && (
          <ul className="grid gap-6 md:grid-cols-2">
            {pubs.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/publications/${p.id}`}
                  className="group block rounded-3xl backdrop-blur-xl bg-white/60 border border-white/30 shadow-xl shadow-slate-200/70 hover:bg-white/70 hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-semibold text-slate-900 group-hover:text-slate-800 leading-snug">
                      {p.title}
                    </h3>

                    {/* Meta */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/70 border border-white/40 px-2.5 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        {p.year ?? "—"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/70 border border-white/40 px-2.5 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        {p.organism ?? "—"}
                      </span>
                    </div>

                    {/* Summary */}
                    <p className="mt-3 text-slate-700 text-sm leading-relaxed line-clamp-3">
                      {p.summary || "No summary yet."}
                    </p>

                    {/* Footer: Authors + Tags */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {/* Authors */}
                      {p.authors.slice(0, 3).map((name, i) => (
                        <span
                          key={`${p.id}-author-${i}`}
                          className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-white/40 px-2.5 py-1 text-xs text-slate-700"
                          title={name}
                        >
                          <span className="grid place-items-center h-5 w-5 rounded-full bg-slate-200/70 border border-white/50 text-[10px] font-semibold text-slate-700">
                            {initials(name)}
                          </span>
                          {name}
                        </span>
                      ))}
                      {p.authors.length > 3 && (
                        <span className="text-xs text-slate-500">
                          +{p.authors.length - 3} more
                        </span>
                      )}

                      {/* Divider dot */}
                      <span className="mx-1 text-slate-300">•</span>

                      {/* Tags */}
                      {p.tags.slice(0, 4).map((t) => (
                        <span
                          key={`${p.id}-tag-${t}`}
                          className="inline-flex items-center rounded-full bg-slate-900/80 text-white/90 border border-white/10 px-2.5 py-1 text-[11px] tracking-wide"
                        >
                          #{t}
                        </span>
                      ))}
                      {p.tags.length > 4 && (
                        <span className="text-xs text-slate-500">
                          +{p.tags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subtle arrow affordance */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-slate-500 mr-1">Open</span>
                      <svg
                        className="w-4 h-4 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

// --- Utils ---
function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  const joined = letters.join("");
  return joined || "?";
}
