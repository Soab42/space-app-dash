"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import CollapsibleHeader from "./CollapsibleHeader";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// --- Types ---
export type Author = {
  id: number;
  name: string;
  affiliation?: string;
};

export type Tag = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  title: string;
};

export type SubCategory = {
  id: number;
  title: string;
  category_id: number;
};

export type Pub = {
  id: number;
  title: string;
  abstract?: string;
  date_month?: string;
  date_year?: number;
  organism?: string;
  environment?: string;
  original_link?: string;
  tags: Tag[];
  authors: Author[];
  summary_of_abstract?: string;
  summary_for_scientist?: string;
  summary_for_investor?: string;
  summary_for_mission_architect?: string;
  podcast_audio_path?: string;
  knowledgeable_insights?: any;
  perspective?: string | null;
  faqs?: any[];
  metadata_json?: Record<string, any>;
  knowledge_graph?: any;
  others_data?: Record<string, any>;
  knowledge_gaps?: any;
  consensus_disagreement?: any;
  category?: Category;
  subcategory?: SubCategory;
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [publications, setPublications] = useState<Pub[]>([]);
  const [totalPublications, setTotalPublications] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [startYear, setStartYear] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [applyFilterTrigger, setApplyFilterTrigger] = useState(0);

  const publicationsPerPage = 10;

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (selectedCategory) {
      const cat = categories.find((c) => c.title === selectedCategory);
      if (cat) params.set("category_id", cat.id.toString());
    }
    if (selectedSubcategory) {
      const subcat = subcategories.find((s) => s.title === selectedSubcategory);
      if (subcat) params.set("subcategory_id", subcat.id.toString());
    }
    if (startYear) params.set("year_from", startYear);
    if (endYear) params.set("year_to", endYear);
    params.set("skip", ((currentPage - 1) * publicationsPerPage).toString());
    params.set("limit", publicationsPerPage.toString());

    const queryString = params.toString();
    try {
      const response = await api<{ total: number; publications: Pub[] }>(
        `/publications${queryString ? `?${queryString}` : ""}`
      );
      setPublications(response.publications);
      setTotalPublications(response.total);
    } catch (error) {
      console.error("Failed to fetch publications:", error);
      setPublications([]);
      setTotalPublications(0);
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    startYear,
    endYear,
    currentPage,
    categories,
    subcategories,
    applyFilterTrigger,
  ]);

  const fetchFilters = async () => {
    try {
      const fetchedCategories = await api<Category[]>("/categories");
      console.log(fetchedCategories);
      setCategories(fetchedCategories);
      const fetchedSubcategories = await api<SubCategory[]>(
        "/categories/subcategories/"
      );
      console.log(fetchedSubcategories);
      setSubcategories(fetchedSubcategories);
    } catch (error) {
      console.error("Failed to fetch filter data:", error);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    // Initialize state from URL search params on first load
    setSearchTerm(searchParams.get("q") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedSubcategory(searchParams.get("subCategory") || "");
    setStartYear(searchParams.get("year_from") || "");
    setEndYear(searchParams.get("year_to") || "");
    setCurrentPage(parseInt(searchParams.get("page") || "1"));
  }, [searchParams]);

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleFilterChange = useCallback(() => {
    setCurrentPage(1); // Reset to first page on filter change
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedSubcategory) params.set("subCategory", selectedSubcategory);
    if (startYear) params.set("year_from", startYear);
    if (endYear) params.set("year_to", endYear);
    params.set("page", "1");
    router.push(`/publications?${params.toString()}`);
    fetchPublications();
  }, [
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    startYear,
    endYear,
    router,
  ]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`/publications?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleClearFilters = useCallback(() => {
    setCurrentPage(1);
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setStartYear("2000");
    setEndYear("2025");
    const params = new URLSearchParams();
    params.set("page", "1");
    router.push(`/publications?${params.toString()}`);
    fetchPublications();
  }, [router]);

  const totalPages = Math.ceil(totalPublications / publicationsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      {/* Header */}
      <CollapsibleHeader
        q={searchTerm}
        category={selectedCategory}
        subCategory={selectedSubcategory}
        resultsCount={totalPublications}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onSubCategoryChange={setSelectedSubcategory}
        onStartYearChange={setStartYear}
        onEndYearChange={setEndYear}
        onApplyFilters={handleFilterChange}
        categories={categories}
        subcategories={subcategories}
        startYear={startYear}
        endYear={endYear}
        handleClearFilters={handleClearFilters}
      />

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {loading && (
          <div className="text-center py-24">Loading publications...</div>
        )}

        {!loading && publications.length === 0 && (
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

        {!loading && publications.length > 0 && (
          <>
            <ul className="grid gap-6 md:grid-cols-2">
              {publications.map((p) => (
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
                          {p.date_month ?? "-"} {p.date_year ?? "-"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/70 border border-white/40 px-2.5 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          {p.organism ?? "-"}
                        </span>
                      </div>

                      {/* Summary */}
                      <p className="mt-3 text-slate-700 text-sm leading-relaxed line-clamp-3">
                        {p.abstract || "No summary yet."}
                      </p>

                      {/* Footer: Authors + Tags */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {/* Authors */}
                        {p.authors.slice(0, 3).map((author, i) => (
                          <span
                            key={`${p.id}-author-${i}`}
                            className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-white/40 px-2.5 py-1 text-xs text-slate-700"
                            title={author.name}
                          >
                            <span className="grid place-items-center h-5 w-5 rounded-full bg-slate-200/70 border border-white/50 text-[10px] font-semibold text-slate-700">
                              {initials(author.name)}
                            </span>
                            {author.name}
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
                        {p.tags.slice(0, 4).map((tag) => (
                          <span
                            key={`${p.id}-tag-${tag.id}`}
                            className="inline-flex items-center rounded-full bg-slate-900/80 text-white/90 border border-white/10 px-2.5 py-1 text-[11px] tracking-wide"
                          >
                            {tag.name}
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
                        <span className="text-xs text-slate-500 mr-1">
                          Open
                        </span>
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

            {/* Pagination */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-slate-900 text-white"
                        : "bg-white/60 border border-white/30 text-slate-700 hover:bg-white/80"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </>
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
