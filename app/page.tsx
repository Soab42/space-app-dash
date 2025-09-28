import { api } from "@/lib/api";
import {Header} from "@/components/Header";
import Link from "next/link";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";

// Optional: add a matching loading UI in /app/(...)/loading.tsx for instant paint.

type Pub = {
  id: number;
  title: string;
  year?: number;
  tags?: { id: number; name: string }[];
  authors?: string[];
};

type Overview = {
  publication_count: number;
  author_count: number;
  tag_count: number;
  year_distribution: Record<string, number>;
  top_tags: Record<string, number>;
};

export default async function Page() {
  let pubs: Pub[] = [];
  let overview: Overview = { publication_count: 0, author_count: 0, tag_count: 0, year_distribution: {}, top_tags: {} };
  let categoriesData: { category: string; count: number }[] = [];

  try {
    pubs = await api<Pub[]>("/publications", { next: { revalidate: 5 } });
    overview = await api<Overview>("/analytics/overview", {
      next: { revalidate: 5 },
    });
    categoriesData = await api<{ category: string; count: number }[]>("/analytics/publications_by_category", {
      next: { revalidate: 5 },
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // You can re-throw the error to be caught by the global error boundary
    // or handle it here specifically.
    throw new Error("Failed to load page data. Please try again later.");
  }

  const categories = categoriesData.sort((a, b) => b.count - a.count);
  const maxCount = categories[0]?.count ?? 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      <Header />

      <main className="w-full mx-auto px-6 py-8">
        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left stacked KPIs */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl backdrop-blur-xl bg-white/60 border border-white/30 shadow-xl shadow-slate-200/70 p-6">
              <h2 className="text-sm font-medium text-slate-600">
                Total Publications
              </h2>
              <div className="mt-2 text-4xl font-semibold text-slate-900 tracking-tight">
                {overview.publication_count.toLocaleString()}
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-200/70 overflow-hidden">
                <div className="h-full w-3/4 bg-slate-900/80" aria-hidden />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Updated every 5 seconds
              </p>
            </div>
            <div className="rounded-3xl backdrop-blur-xl bg-white/60 border border-white/30 shadow-xl shadow-slate-200/70 p-6">
              <h2 className="text-sm font-medium text-slate-600">
                Total Authors
              </h2>
              <div className="mt-2 text-4xl font-semibold text-slate-900 tracking-tight">
                {overview.author_count.toLocaleString()}
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-200/70 overflow-hidden">
                <div className="h-full w-2/3 bg-slate-900/80" aria-hidden />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Aggregated across all publications
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="rounded-3xl backdrop-blur-xl bg-white/60 border border-white/30 shadow-xl shadow-slate-200/70 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Publications by Category
            </h2>
            <ul className="space-y-2">
              {categories.slice(0, 7).map((c) => {
                const pct = Math.max(6, Math.round((c.count / maxCount) * 100));
                return (
                  <li key={c.category}>
                    <Link
                      href={`/publications?category=${encodeURIComponent(
                        c.category
                      )}`}
                      className="group block rounded-2xl px-3 py-2 transition-colors hover:bg-white/50"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-800 group-hover:text-slate-900">
                          {c.category}
                        </span>
                        <span className="text-slate-600 font-semibold">
                          {c.count}
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-200/70 overflow-hidden">
                        <div
                          className="h-full bg-slate-900/80"
                          style={{ width: `${pct}%` }}
                          aria-hidden
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
              {categories.length === 0 && (
                <li className="text-sm text-slate-500">No categories yet.</li>
              )}
            </ul>
          </div>

          {/* Recent Publications */}
          <div className="rounded-3xl backdrop-blur-xl bg-white/60 border border-white/30 shadow-xl shadow-slate-200/70 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Recent Publications
            </h2>
            <ul className="space-y-2">
              {pubs.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/publications/${p.id}`}
                    className="group flex items-start gap-3 rounded-2xl px-3 py-2 hover:bg-white/50 transition-colors"
                  >
                    <div className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800 group-hover:text-slate-900 line-clamp-2">
                        {p.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {p.year ?? "—"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
              {pubs.length === 0 && (
                <li className="text-sm text-slate-500">
                  No publications available.
                </li>
              )}
            </ul>
          </div>
        </section>

        {/* Charts */}
        <section className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-3 rounded-3xl backdrop-blur-xl bg-white/60 border border-white/30 shadow-xl shadow-slate-200/70 p-6 space-y-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Analytics
              </h2>
              <div className="text-xs text-slate-500">Auto-refreshed</div>
            </div>
            <AnalyticsCharts />
          </div>
        </section>
      </main>
    </div>
  );
}
