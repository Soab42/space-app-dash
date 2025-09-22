import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import Link from "next/link";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";

export default async function Page() {
  const pubs = await api<any[]>("/publications", { next: { revalidate: 5 } });
  const total = { count: pubs.length };

  const categories: { category: string; count: number }[] = (
    (pubs as any[])
      .flatMap((p) => p.tags || [])
      .reduce((acc, tag) => {
        const existing = acc.find((item) => item.category === tag);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ category: tag, count: 1 });
        }
        return acc;
      }, [] as { category: string; count: number }[]) as any[]
  ).sort((a, b) => b.count - a.count);
  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Total Publications</h2>
          <div className="text-4xl font-bold">{total.count}</div>
        </div>
        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Publications by Category
          </h2>
          <div className="flex flex-col gap-2">
            {categories.slice(0, 7).map((c) => (
              <Link
                href={`/publications?category=${c.category}`}
                key={c.category}
                className="flex justify-between hover:bg-gray-700 px-2 py-1 rounded"
              >
                <span className="text-blue-400">{c.category}</span>
                <span className="font-bold">{c.count}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Publications</h2>
          <div className="flex flex-col gap-2">
            {pubs.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={`/publications/${p.id}`}
                className="text-blue-400 hover:underline"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <AnalyticsCharts />
      </div>
    </div>
  );
}
