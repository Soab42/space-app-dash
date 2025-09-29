"use client";
import React, { useState, useEffect } from "react";
import { API_BASE } from "@/lib/api";

interface Subcategory {
  id: number;
  title: string;
  category_id: number;
}

interface Category {
  id: number;
  title: string;
  subcategories: Subcategory[];
}

export default function UploadForm() {
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    date_year: "",
    date_month: "",
    organism: "",
    environment: "",
    original_link: "",
    authors: "",
    text: "",
    podcast_audio_path: "",
    category_id: "",
    subcategory_id: "",
    others_data: "",
  });
  const [pdf, setPdf] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [resp, setResp] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        if (res.ok) {
          setCategories(await res.json());
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const subcategories = categories.find(
    (c) => c.id == Number(formData.category_id)
  )?.subcategories;


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResp(null);

    try {
      const meta = {
        ...formData,
        authors: JSON.parse(formData.authors || "[]"),
        subcategory_id: Number(formData.subcategory_id) || null,
        metadata_json: {},
        others_data: JSON.parse(formData.others_data || "{}"),
      };
      
      const fd = new FormData();
      fd.append("metadata_json", JSON.stringify(meta));
      if (pdf) fd.append("pdf", pdf);

      const res = await fetch(`${API_BASE}/publications`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      setResp(await res.json());
    } catch (error: any) {
      console.error(error);
      alert(error?.message);
    } finally {
      setBusy(false);
    }
  }
console.log(categories);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
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
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">
                  Basic Information
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter publication title"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="abstract"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Abstract
                  </label>
                  <textarea
                    id="abstract"
                    value={formData.abstract}
                    onChange={handleChange}
                    placeholder="Enter publication abstract"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 resize-none"
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">Metadata</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="date_year"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Year
                  </label>
                  <input
                    id="date_year"
                    value={formData.date_year}
                    onChange={handleChange}
                    placeholder="2024"
                    type="number"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="date_month"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Month
                  </label>
                  <input
                    id="date_month"
                    value={formData.date_month}
                    onChange={handleChange}
                    placeholder="March"
                    type="string"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="organism"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Organism
                  </label>
                  <input
                    id="organism"
                    value={formData.organism}
                    onChange={handleChange}
                    placeholder="e.g., Homo sapiens"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="environment"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Environment
                  </label>
                  <input
                    id="environment"
                    value={formData.environment}
                    onChange={handleChange}
                    placeholder="e.g., Laboratory"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="original_link"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Original Link
                  </label>
                  <input
                    id="original_link"
                    value={formData.original_link}
                    onChange={handleChange}
                    placeholder="https://doi.org/..."
                    type="url"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label
                  htmlFor="category_id"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-6">
                <label
                  htmlFor="subcategory_id"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Subcategory
                </label>
                <select
                  id="subcategory_id"
                  value={formData.subcategory_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800"
                >
                  <option value="">Select a subcategory</option>
                  {subcategories?.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.title}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">Authors</h2>
              </div>
              <div>
                <label
                  htmlFor="authors"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Authors (JSON Format)
                </label>
                <textarea
                  id="authors"
                  value={formData.authors}
                  onChange={handleChange}
                  placeholder='[{"name":"A. Smith","affiliation":"JSC","orcid":"0000-...","rank":1}]'
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 font-mono text-sm resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Provide author information in JSON format
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">
                  Related Content
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="podcast_audio_path"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Podcast Audio Path
                  </label>
                  <input
                    id="podcast_audio_path"
                    value={formData.podcast_audio_path}
                    onChange={handleChange}
                    placeholder="/path/to/audio.mp3"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-medium text-slate-800">Content</h2>
              </div>
              <div className="backdrop-blur-sm bg-slate-50/50 rounded-xl p-6 border border-slate-200/30 mb-6">
                <p className="text-sm text-slate-600 flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Provide either a PDF file or raw text content. If both are
                  provided, the PDF will be processed for content extraction.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="pdf-upload"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
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
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Selected: {pdf.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="text"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Raw Text Content
                  </label>
                  <textarea
                    id="text"
                    value={formData.text}
                    onChange={handleChange}
                    placeholder="Paste the full text content here (optional if PDF is provided)"
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 font-mono text-sm resize-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="others_data"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Others Data (JSON Format)
                  </label>
                  <textarea
                    id="others_data"
                    value={formData.others_data}
                    onChange={handleChange}
                    placeholder="{}"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition-all duration-200 text-slate-800 font-mono text-sm resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Provide other data in JSON format
                  </p>
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-6 border-t border-slate-200/30">
              <button
                disabled={busy}
                className="px-8 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-slate-800/25 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
              >
                {busy ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Upload & Process"
                )}
              </button>
            </div>
          </div>

          {resp && (
            <div className="mt-8 pt-8 border-t border-slate-200/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-medium text-slate-800">
                  Upload Successful
                </h3>
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
    </div>
  );
}
