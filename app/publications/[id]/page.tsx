
// import { api } from "@/lib/api";
// import ChatRAG from "@/components/ChatRAG";
// import Link from "next/link";
// import KnowledgeGraph, { EdgeDatum, NodeDatum } from "@/components/KnowledgeGraph";
// interface Pub {
//   id: number;
//   title: string;
//   year?: number;
//   organism?: string;
//   environment?: string;
//   summary?: string;
//   key_findings?: string[];
//   original_link?: string;
//   methods?: string;
//   results?: string;
//   discussion?: string;
//   conclusions?: string;
//   references?: string[];
//   acknowledgments?: Array<string>;
//   actionable_insights?: Array<string>;
//   knowledge_graph?: { nodes: NodeDatum[]; edges: EdgeDatum[] };
//   tags?: string[];
//   authors?: string[];
// }
// export default async function Page({ params }: { params: { id: string } }) {
//   const pub = await api<Pub>(`/publications/${params.id}`);
//   console.log(pub);
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
//       {/* Header Section */}
//       <header className="backdrop-blur-xl bg-white/80 shadow-sm border-b border-white/20">
//         <div className="max-w-7xl mx-auto px-6 py-10">
//           <div className="flex flex-col space-y-6">
//             <h1 className="text-4xl font-light text-slate-900 leading-tight tracking-tight">
//               {pub.title}
//             </h1>
            
//             <div className="flex flex-wrap items-center gap-8 text-sm">
//               <div className="flex items-center gap-3">
//                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
//                 <span className="font-medium text-slate-700">Year</span>
//                 <span className="text-slate-600">{pub.year ?? "—"}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
//                 <span className="font-medium text-slate-700">Organism</span>
//                 <span className="text-slate-600">{pub.organism ?? "—"}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
//                 <span className="font-medium text-slate-700">Environment</span>
//                 <span className="text-slate-600">{pub.environment ?? "—"}</span>
//               </div>
//             </div>
            
//             {pub.original_link && (
//               <div className="pt-2">
//                 <a
//                   className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-all duration-300 group border-b border-transparent hover:border-slate-300"
//                   href={pub.original_link}
//                   target="_blank"
//                 >
//                   <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                   </svg>
//                   View Original Publication
//                 </a>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-6 py-12">
//         <div className="grid lg:grid-cols-4 gap-8">
//           {/* Left Content - 3 columns */}
//           <div className="lg:col-span-3 space-y-8">
//             {/* Executive Summary */}
//             <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
//               <div className="px-8 py-6 border-b border-slate-200/30">
//                 <h2 className="text-xl font-medium text-slate-800 flex items-center gap-3">
//                   <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
//                   Executive Summary
//                 </h2>
//               </div>
//               <div className="px-8 py-8">
//                 <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap">
//                   {pub.summary || "No summary available"}
//                 </p>
//               </div>
//             </section>

//             {/* Key Findings & Methods Grid */}
//             <div className="grid md:grid-cols-2 gap-8">
//               <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
//                 <div className="px-6 py-5 border-b border-slate-200/30">
//                   <h3 className="text-lg font-medium text-slate-800 flex items-center gap-3">
//                     <div className="w-1 h-5 bg-slate-400 rounded-full"></div>
//                     Key Findings
//                   </h3>
//                 </div>
//                 <div className="px-6 py-6">
//                   {pub.key_findings && pub.key_findings.length > 0 ? (
//                     <ul className="space-y-4">
//                       {pub.key_findings.map((finding: string, index: number) => (
//                         <li key={index} className="flex items-start gap-4">
//                           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></div>
//                           <span className="text-slate-700 leading-relaxed text-sm">{finding}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text-slate-500 italic">No key findings available</p>
//                   )}
//                 </div>
//               </section>

//               <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
//                 <div className="px-6 py-5 border-b border-slate-200/30">
//                   <h3 className="text-lg font-medium text-slate-800 flex items-center gap-3">
//                     <div className="w-1 h-5 bg-slate-400 rounded-full"></div>
//                     Methods
//                   </h3>
//                 </div>
//                 <div className="px-6 py-6">
//                   <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
//                     {pub.methods || "No methods information available"}
//                   </p>
//                 </div>
//               </section>
//             </div>

//             {/* Conclusions */}
//             <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
//               <div className="px-8 py-6 border-b border-slate-200/30">
//                 <h3 className="text-lg font-medium text-slate-800 flex items-center gap-3">
//                   <div className="w-1 h-5 bg-slate-400 rounded-full"></div>
//                   Conclusions
//                 </h3>
//               </div>
//               <div className="px-8 py-8">
//                 <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap">
//                   {pub.conclusions || "No conclusions available"}
//                 </p>
//               </div>
//             </section>

//             {/* Metadata */}
//             <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
//               <div className="px-8 py-6 border-b border-slate-200/30">
//                 <h3 className="text-lg font-medium text-slate-800 flex items-center gap-3">
//                   <div className="w-1 h-5 bg-slate-400 rounded-full"></div>
//                   Metadata
//                 </h3>
//               </div>
//               <div className="px-8 py-8 space-y-6">
//                 <div className="grid md:grid-cols-2 gap-8">
//                   <div>
//                     <span className="font-medium text-slate-800 block mb-3">Authors</span>
//                     <p className="text-slate-600 text-sm leading-relaxed">
//                       {pub.authors?.map((a: string) => a).join(", ") || "No authors listed"}
//                     </p>
//                   </div>
//                   <div>
//                     <span className="font-medium text-slate-800 block mb-3">Tags</span>
//                     <div className="flex flex-wrap gap-2">
//                       {pub.tags && pub.tags.length > 0 ? (
//                         pub.tags.map((tag: string, index: number) => (
//                           <Link
//                             key={index}
//                             href={`/publications?category=${tag}`}
//                             className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 border border-slate-200/50 transition-all duration-200 backdrop-blur-sm"
//                           >
//                             #{tag}
//                           </Link>
//                         ))
//                       ) : (
//                         <span className="text-slate-500 italic text-sm">No tags available</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* Right Sidebar */}
//           <aside className="lg:col-span-1 space-y-8">
//             {/* Chat RAG */}
//             <div className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
//               <div className="px-6 py-5 border-b border-slate-200/30">
//                 <h3 className="font-medium text-slate-800 flex items-center gap-3">
//                   <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
//                   Ask Questions
//                 </h3>
//               </div>
//               <div className="p-6">
//                 <ChatRAG publicationId={Number(params.id)} />
//               </div>
//             </div>

//             {/* Actionable Insights */}
//             {pub.actionable_insights && pub.actionable_insights.length > 0 && (
//               <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
//                 <div className="px-6 py-5 border-b border-slate-200/30">
//                   <h3 className="font-medium text-slate-800 flex items-center gap-3">
//                     <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
//                     Actionable Insights
//                   </h3>
//                 </div>
//                 <div className="p-6">
//                   <ul className="space-y-4">
//                     {pub.actionable_insights.map((insight: string, index: number) => (
//                       <li key={index} className="flex items-start gap-3">
//                         <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
//                         <span className="text-slate-700 text-sm leading-relaxed">{insight}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </section>
//             )}
//           </aside>
//         </div>

//         {/* Knowledge Graph */}
//         {pub.knowledge_graph && (
//           <section className="mt-12 backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
//             <div className="px-8 py-6 border-b border-slate-200/30">
//               <h3 className="text-xl font-medium text-slate-800 flex items-center gap-3">
//                 <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
//                 Knowledge Graph
//               </h3>
//             </div>
//             <div className="p-8">
//               <KnowledgeGraph data={pub.knowledge_graph} />
//             </div>
//           </section>
//         )}
//       </main>
//     </div>
//   );
// }

import { api } from "@/lib/api";
import ChatRAG from "@/components/ChatRAG";
import Link from "next/link";
import KnowledgeGraph, {
  EdgeDatum,
  NodeDatum,
} from "@/components/KnowledgeGraph";

// Define more specific types based on the provided JSON data
interface Tag {
  id: number;
  name: string;
}

interface Author {
  id: number;
  name: string;
  affiliation: string;
}

interface KnowledgeableInsights {
  recent_advances: string[];
  key_breakthroughs: string[];
  impact_on_field: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface KnowledgeGaps {
  current_limitations: string[];
  research_needs: string[];
  future_directions: string[];
}

interface ConsensusDisagreement {
  scientific_consensus: string[];
  areas_of_debate: string[];
  community_perspectives: string[];
}

interface Pub {
  id: number;
  title: string;
  abstract: string;
  date_month: string;
  date_year: number;
  organism: string;
  environment: string;
  original_link?: string;
  tags?: Tag[];
  authors?: Author[];
  summary_for_scientist: string;
  summary_for_investor: string;
  summary_for_mission_architect: string;
  knowledgeable_insights?: KnowledgeableInsights;
  faqs?: FAQ[];
  knowledge_graph?: { nodes: NodeDatum[]; edges: EdgeDatum[] };
  knowledge_gaps?: KnowledgeGaps;
  consensus_disagreement?: ConsensusDisagreement;
}

// Helper component for list items
const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-4">
    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></div>
    <span className="text-slate-700 leading-relaxed text-sm">{children}</span>
  </li>
);

export default async function Page({ params }: { params: { id: string } }) {
  const pub = await api<Pub>(`/publications/${params.id}`);

  const keyFindings = pub.knowledgeable_insights
    ? [
        ...pub.knowledgeable_insights.recent_advances,
        ...pub.knowledgeable_insights.key_breakthroughs,
        ...pub.knowledgeable_insights.impact_on_field,
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header Section */}
      <header className="backdrop-blur-xl bg-white/80 shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl font-light text-slate-900 leading-tight tracking-tight">
              {pub.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                <span className="font-medium text-slate-700">Date</span>
                <span className="text-slate-600">
                  {pub.date_month} {pub.date_year ?? "—"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                <span className="font-medium text-slate-700">Organism</span>
                <span className="text-slate-600">{pub.organism ?? "—"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                <span className="font-medium text-slate-700">Environment</span>
                <span className="text-slate-600">
                  {pub.environment ?? "—"}
                </span>
              </div>
            </div>

            {pub.original_link && (
              <div className="pt-2">
                <a
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-all duration-300 group border-b border-transparent hover:border-slate-300"
                  href={pub.original_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View Original Publication
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Content - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Abstract */}
            <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
              <div className="px-8 py-6 border-b border-slate-200/30">
                <h2 className="text-xl font-medium text-slate-800 flex items-center gap-3">
                  <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                  Abstract
                </h2>
              </div>
              <div className="px-8 py-8">
                <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap">
                  {pub.abstract || "No abstract available"}
                </p>
              </div>
            </section>

            {/* Key Findings & Perspectives Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
                <div className="px-6 py-5 border-b border-slate-200/30">
                  <h3 className="text-lg font-medium text-slate-800 flex items-center gap-3">
                    <div className="w-1 h-5 bg-slate-400 rounded-full"></div>
                    Key Insights
                  </h3>
                </div>
                <div className="px-6 py-6">
                  {keyFindings.length > 0 ? (
                    <ul className="space-y-4">
                      {keyFindings.map((finding: string, index: number) => (
                        <ListItem key={index}>{finding}</ListItem>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic">
                      No key insights available
                    </p>
                  )}
                </div>
              </section>

              <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
                <div className="px-6 py-5 border-b border-slate-200/30">
                  <h3 className="text-lg font-medium text-slate-800 flex items-center gap-3">
                    <div className="w-1 h-5 bg-slate-400 rounded-full"></div>
                    Perspectives
                  </h3>
                </div>
                <div className="px-6 py-6 space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2 text-sm">
                      For Scientists
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-sm">
                      {pub.summary_for_scientist}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2 text-sm">
                      For Investors
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-sm">
                      {pub.summary_for_investor}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2 text-sm">
                      For Mission Architects
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-sm">
                      {pub.summary_for_mission_architect}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Knowledge Gaps */}
            {pub.knowledge_gaps && (
              <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
                <div className="px-8 py-6 border-b border-slate-200/30">
                  <h3 className="text-lg font-medium text-slate-800 flex items-center gap-3">
                    <div className="w-1 h-5 bg-slate-400 rounded-full"></div>
                    Knowledge Gaps
                  </h3>
                </div>
                <div className="px-8 py-8 space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">
                      Current Limitations
                    </h4>
                    <ul className="space-y-3">
                      {pub.knowledge_gaps.current_limitations.map(
                        (item, i) => (
                          <ListItem key={i}>{item}</ListItem>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">
                      Research Needs
                    </h4>
                    <ul className="space-y-3">
                      {pub.knowledge_gaps.research_needs.map((item, i) => (
                        <ListItem key={i}>{item}</ListItem>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">
                      Future Directions
                    </h4>
                    <ul className="space-y-3">
                      {pub.knowledge_gaps.future_directions.map((item, i) => (
                        <ListItem key={i}>{item}</ListItem>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}
            
            {/* Consensus & Disagreement */}
            {pub.consensus_disagreement && (
              <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
                <div className="px-8 py-6 border-b border-slate-200/30">
                  <h3 className="text-lg font-medium text-slate-800 flex items-center gap-3">
                    <div className="w-1 h-5 bg-slate-400 rounded-full"></div>
                    Community Consensus & Debate
                  </h3>
                </div>
                <div className="px-8 py-8 space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">
                      Scientific Consensus
                    </h4>
                    <ul className="space-y-3">
                      {pub.consensus_disagreement.scientific_consensus.map(
                        (item, i) => (
                          <ListItem key={i}>{item}</ListItem>
                        )
                      )}
                    </ul>
                  </div>
                   <div>
                    <h4 className="font-semibold text-slate-800 mb-3">
                      Areas of Debate
                    </h4>
                    <ul className="space-y-3">
                      {pub.consensus_disagreement.areas_of_debate.map((item, i) => (
                        <ListItem key={i}>{item}</ListItem>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Metadata */}
            <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
              <div className="px-8 py-6 border-b border-slate-200/30">
                <h3 className="text-lg font-medium text-slate-800 flex items-center gap-3">
                  <div className="w-1 h-5 bg-slate-400 rounded-full"></div>
                  Metadata
                </h3>
              </div>
              <div className="px-8 py-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <span className="font-medium text-slate-800 block mb-3">
                      Authors
                    </span>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {pub.authors?.map((a) => a.name).join(", ") ||
                        "No authors listed"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-800 block mb-3">
                      Tags
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {pub.tags && pub.tags.length > 0 ? (
                        pub.tags.map((tag) => (
                          <Link
                            key={tag.id}
                            href={`/publications?category=${tag.name}`}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 border border-slate-200/50 transition-all duration-200 backdrop-blur-sm"
                          >
                            #{tag.name}
                          </Link>
                        ))
                      ) : (
                        <span className="text-slate-500 italic text-sm">
                          No tags available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Chat RAG */}
            <ChatRAG publicationId={Number(params.id)} />

            {/* FAQs */}
            {pub.faqs && pub.faqs.length > 0 && (
              <section className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
                <div className="px-6 py-5 border-b border-slate-200/30">
                  <h3 className="font-medium text-slate-800 flex items-center gap-3">
                    <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                    FAQs
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {pub.faqs.map((faq, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-slate-800 text-sm mb-1">
                          {faq.question}
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </aside>
        </div>

        {/* Knowledge Graph */}
        {pub.knowledge_graph && (
          <section className="mt-12 backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
            <div className="px-8 py-6 border-b border-slate-200/30">
              <h3 className="text-xl font-medium text-slate-800 flex items-center gap-3">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                Knowledge Graph
              </h3>
            </div>
            <div className="p-8">
              <KnowledgeGraph data={pub.knowledge_graph} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}