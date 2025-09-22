import { api } from "@/lib/api";
import ChatRAG from "@/components/ChatRAG";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const pub = await api(`/publications/${params.id}`);
  console.log(pub);
  return (
    <div className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{pub.title}</h1>
        <div className="text-sm text-gray-300">{pub.year ?? "—"} • {pub.organism ?? "—"} • {pub.environment ?? "—"}</div>
        {pub.original_link && <a className="text-blue-400 hover:underline" href={pub.original_link} target="_blank">View Original Publication</a>}
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: summaries */}
        <div className="lg:col-span-2 space-y-4">
          <section className="glass-card p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">Executive Summary</h2>
            <p className="text-sm whitespace-pre-wrap text-gray-300">{pub.summary || "—"}</p>
          </section>

          <div className="grid md:grid-cols-2 gap-4">
            <section className="glass-card p-4 rounded-lg">
              <h3 className="font-semibold">Key Findings</h3>
              <div className="text-sm whitespace-pre-wrap text-gray-300">
                {pub.key_findings?.map((k:string) => <li className="list-disc list-inside" key={k} >{k}</li>).reduce((prev, curr) => <>{prev} {curr}</>, <></>) || "—"}
              </div>
            </section>
            <section className="glass-card p-4 rounded-lg">
              <h3 className="font-semibold">Methods</h3>
              <div className="text-sm whitespace-pre-wrap text-gray-300">{pub.methods || "—"}</div>
            </section>
          </div>

          <section className="glass-card p-4 rounded-lg">
            <h3 className="font-semibold">Conclusions</h3>
            <div className="text-sm whitespace-pre-wrap text-gray-300">{pub.conclusions || "—"}</div>
          </section>
        </div>

        {/* Right: meta + chat */}
        <aside className="space-y-4">
          <ChatRAG publicationId={Number(params.id)} />
          <div className="glass-card p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Metadata</h3>
            <div className="text-sm mb-1"><span className="font-semibold">Authors:</span> {pub.authors?.map(a => a).join(", ") || "—"}</div>
            <div className="text-sm mb-1"><span className="font-semibold">Tags:</span> {pub.tags?.map((t:string) => <Link href={`/publications?category=${t}`} className="text-blue-400 hover:underline">#{t}</Link>).reduce((prev, curr) => <>{prev} {curr}</>, <></>) || "—"}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}