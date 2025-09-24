// "use client";
// import React, { useState } from "react";
// import { API_BASE } from "@/lib/api";

// export default function UploadForm() {
//   const [pdf, setPdf] = useState<File | null>(null);
//   const [busy, setBusy] = useState(false);
//   const [resp, setResp] = useState<any>(null);

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setBusy(true);
//     setResp(null);

//     const meta = {
//       title: (document.getElementById("title") as HTMLInputElement).value,
//       abstract:
//         (document.getElementById("abstract") as HTMLTextAreaElement).value ||
//         null,
//       year:
//         Number((document.getElementById("year") as HTMLInputElement).value) ||
//         null,
//       organism:
//         (document.getElementById("organism") as HTMLInputElement).value || null,
//       environment:
//         (document.getElementById("environment") as HTMLInputElement).value ||
//         null,
//       original_link:
//         (document.getElementById("original_link") as HTMLInputElement).value ||
//         null,
//       tags: ((document.getElementById("tags") as HTMLInputElement).value || "")
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean),
//       authors: JSON.parse(
//         (document.getElementById("authors") as HTMLTextAreaElement).value ||
//           "[]"
//       ),
//       metadata_json: {},
//       text:
//         (document.getElementById("text") as HTMLTextAreaElement).value || null,
//     };

//     const fd = new FormData();
//     fd.append("metadata_json", JSON.stringify(meta));
//     if (pdf) fd.append("pdf", pdf);

//     const res = await fetch(`${API_BASE}/publications`, {
//       method: "POST",
//       body: fd,
//     });
//     if (!res.ok) {
//       setBusy(false);
//       alert(await res.text());
//       return;
//     }
//     setResp(await res.json());
//     setBusy(false);
//   }

//   return (
//     <form onSubmit={onSubmit} className="space-y-4 max-w-2xl glass-card p-6 rounded-lg">
//       <input
//         id="title"
//         placeholder="Title"
//         className="w-full p-2 rounded bg-transparent border border-gray-700"
//         required
//       />
//       <textarea
//         id="abstract"
//         placeholder="Abstract"
//         className="w-full p-2 rounded bg-transparent border border-gray-700"
//       />
//       <div className="grid grid-cols-3 gap-2">
//         <input id="year" placeholder="Year" className="p-2 rounded bg-transparent border border-gray-700" />
//         <input
//           id="organism"
//           placeholder="Organism"
//           className="p-2 rounded bg-transparent border border-gray-700"
//         />
//         <input
//           id="environment"
//           placeholder="Environment"
//           className="p-2 rounded bg-transparent border border-gray-700"
//         />
//       </div>
//       <input
//         id="original_link"
//         placeholder="Original link"
//         className="w-full p-2 rounded bg-transparent border border-gray-700"
//       />
//       <input
//         id="tags"
//         placeholder="Tags (comma separated)"
//         className="w-full p-2 rounded bg-transparent border border-gray-700"
//       />
//       <textarea
//         id="authors"
//         placeholder='Authors JSON e.g. [{"name":"A. Smith","affiliation":"JSC","orcid":"0000-...","rank":1}]'
//         className="w-full p-2 rounded h-24 bg-transparent border border-gray-700"
//       />
//       <div className="text-sm text-gray-300">
//         Provide either PDF or raw text below.
//       </div>
//       <input
//         type="file"
//         accept="application/pdf"
//         onChange={(e) => setPdf(e.target.files?.[0] || null)}
//         className="w-full p-2 rounded bg-transparent border border-gray-700"
//       />
//       <textarea
//         id="text"
//         placeholder="Raw full text (optional if PDF provided)"
//         className="w-full p-2 rounded h-40 bg-transparent border border-gray-700"
//       />
//       <button disabled={busy} className="border border-gray-700 px-4 py-2 rounded hover:bg-white/10">
//         {busy ? "Uploading..." : "Upload & Ingest"}
//       </button>
//       {resp && (
//         <pre className="glass-card p-2 rounded overflow-x-auto bg-transparent border border-gray-700">
//           {JSON.stringify(resp, null, 2)}
//         </pre>
//       )}
//     </form>
//   );
// }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-slate-900 mb-4 tracking-tight">
            Upload Publication
          </h1>
          <p className="text-slate-600 text-lg">
            Add a new research publication to the knowledge base
          </p>
        </div>

        <form 
          onSubmit={onSubmit} 
          className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50 p-10"
        >
          <div className="space-y-8">
            {/* Basic Information Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">Basic Information</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="title"
                    placeholder="Enter publication title"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="abstract" className="block text-sm font-medium text-slate-700 mb-2">
                    Abstract
                  </label>
                  <textarea
                    id="abstract"
                    placeholder="Enter publication abstract"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Metadata Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">Metadata</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-slate-700 mb-2">
                    Year
                  </label>
                  <input 
                    id="year" 
                    placeholder="2024" 
                    type="number"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500" 
                  />
                </div>
                <div>
                  <label htmlFor="organism" className="block text-sm font-medium text-slate-700 mb-2">
                    Organism
                  </label>
                  <input
                    id="organism"
                    placeholder="e.g., Homo sapiens"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label htmlFor="environment" className="block text-sm font-medium text-slate-700 mb-2">
                    Environment
                  </label>
                  <input
                    id="environment"
                    placeholder="e.g., Laboratory"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="original_link" className="block text-sm font-medium text-slate-700 mb-2">
                    Original Link
                  </label>
                  <input
                    id="original_link"
                    placeholder="https://doi.org/..."
                    type="url"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">
                    Tags
                  </label>
                  <input
                    id="tags"
                    placeholder="biology, research, analysis"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Separate multiple tags with commas</p>
                </div>
              </div>
            </section>

            {/* Authors Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">Authors</h2>
              </div>
              
              <div>
                <label htmlFor="authors" className="block text-sm font-medium text-slate-700 mb-2">
                  Authors (JSON Format)
                </label>
                <textarea
                  id="authors"
                  placeholder='[{"name":"A. Smith","affiliation":"JSC","orcid":"0000-...","rank":1}]'
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 font-mono text-sm resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">Provide author information in JSON format</p>
              </div>
            </section>

            {/* Content Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">Content</h2>
              </div>
              
              <div className="backdrop-blur-sm bg-slate-50/50 rounded-xl p-6 border border-slate-200/30 mb-6">
                <p className="text-sm text-slate-600 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Provide either a PDF file or raw text content. If both are provided, the PDF will be processed for content extraction.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="pdf-upload" className="block text-sm font-medium text-slate-700 mb-2">
                    PDF File
                  </label>
                  <div className="relative">
                    <input
                      id="pdf-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setPdf(e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100/80 file:text-slate-700 hover:file:bg-slate-200/80"
                    />
                  </div>
                  {pdf && (
                    <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Selected: {pdf.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="text" className="block text-sm font-medium text-slate-700 mb-2">
                    Raw Text Content
                  </label>
                  <textarea
                    id="text"
                    placeholder="Paste the full text content here (optional if PDF is provided)"
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 font-mono text-sm resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-slate-200/30">
              <button 
                disabled={busy} 
                className="px-8 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-slate-800/25 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
              >
                {busy ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Upload & Process"
                )}
              </button>
            </div>
          </div>

          {/* Response Section */}
          {resp && (
            <div className="mt-8 pt-8 border-t border-slate-200/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-medium text-slate-800">Upload Successful</h3>
              </div>
              <div className="backdrop-blur-sm bg-green-50/50 rounded-xl p-6 border border-green-200/50">
                <pre className="text-sm text-slate-700 overflow-x-auto whitespace-pre-wrap font-mono">
                  {JSON.stringify(resp, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </form>

      </div>
      <p className="text-sm text-gray-400 mt-6">
        Tip: For authors, paste JSON like: {JSON.stringify({name: "Jane Doe", affiliation: "NASA", rank: 1})}
      </p>
    </div>
  );
}