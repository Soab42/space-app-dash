"use client";

import DualRangeSlider from "@/components/DualRangeSlider";
import { useState } from "react";
import { Category, SubCategory } from "./page";

interface CollapsibleHeaderProps {
  q: string;
  category: string;
  subCategory: string;
  startYear: string;
  endYear: string;
  resultsCount: number;
  onSearchChange: (q: string) => void;
  onCategoryChange: (category: string) => void;
  onSubCategoryChange: (subCategory: string) => void;
  onStartYearChange: (year: string) => void;
  onEndYearChange: (year: string) => void;
  onApplyFilters: () => void;
  categories: Category[];
  subcategories: SubCategory[];
  handleClearFilters: () => void;
}

export default function CollapsibleHeader({
  q,
  category,
  subCategory,
  startYear,
  endYear,
  resultsCount,
  onSearchChange,
  onCategoryChange,
  onSubCategoryChange,
  onStartYearChange,
  onEndYearChange,
  onApplyFilters,
  categories,
  subcategories,
  handleClearFilters,
}: CollapsibleHeaderProps) {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onApplyFilters();
  };

  const handleClearAll = () => {
    handleClearFilters();
  };

  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/60 border-b border-white/20 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight text-slate-900">
                Publications
              </h1>
              <p className="text-slate-600 mt-2 max-w-2xl hidden lg:block">
                Discover the latest research in the field of marine biology and
                explore the wonders of the ocean together.
              </p>
            </div>

            {/* Collapse/Expand Toggle Button */}
            <button
              onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
              className="p-2 rounded-lg bg-white/60 border border-white/40 shadow-lg shadow-slate-200/50 backdrop-blur-xl text-slate-600 hover:text-slate-800 hover:bg-white/70 transition-all duration-200"
              aria-label={
                isHeaderCollapsed ? "Expand header" : "Collapse header"
              }
            >
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  isHeaderCollapsed ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Collapsible Content */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              isHeaderCollapsed
                ? "max-h-0 opacity-0 overflow-hidden"
                : "max-h-96 opacity-100"
            }`}
          >
            {/* Search / Filter Form */}
            <form className="w-full sm:w-auto" onSubmit={handleSubmit}>
              <div className="flex gap-2 flex-col lg:flex-row items-center w-full">
                <div className="relative flex-1 w-full">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    value={q}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search title / abstract…"
                    className="w-full min-w-96 pl-12 pr-4 py-3 rounded-2xl bg-white/60 border border-white/40 shadow-lg shadow-slate-200/50 backdrop-blur-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent transition"
                  />
                </div>

                <select
                  value={category}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="px-3 py-3 w-full min-w-48 rounded-2xl bg-white/60 border border-white/40 shadow-lg shadow-slate-200/50 backdrop-blur-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.title}>
                      {cat.title}
                    </option>
                  ))}
                </select>

                {category && subcategories.length > 0 && (
                  <select
                    value={subCategory}
                    onChange={(e) => onSubCategoryChange(e.target.value)}
                    className="px-3 py-3 w-full min-w-48 rounded-2xl bg-white/60 border border-white/40 shadow-lg shadow-slate-200/50 backdrop-blur-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                  >
                    <option value="">All Sub Category</option>
                    {subcategories
                      .filter((subcat) => {
                        const selectedCat = categories.find(
                          (c) => c.title === category
                        );
                        return (
                          !selectedCat || subcat.category_id === selectedCat.id
                        );
                      })
                      .map((subcat) => (
                        <option key={subcat.id} value={subcat.title}>
                          {subcat.title}
                        </option>
                      ))}
                  </select>
                )}

                <div className="flex flex-col gap-2 w-full min-w-48">
                  <DualRangeSlider
                    min={2000}
                    max={2025}
                    step={1}
                    initialMin={parseInt(startYear) || 2010}
                    initialMax={parseInt(endYear) || 2020}
                    label="Select Year Range"
                    formatValue={(value) => value}
                    onChange={(newStartYear, newEndYear) => {
                      onStartYearChange(newStartYear.toString());
                      onEndYearChange(newEndYear.toString());
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 w-full min-w-48 rounded-2xl bg-slate-900 text-white cursor-pointer font-medium shadow-lg shadow-slate-900/25 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/60 transition"
                >
                  Apply Filters
                </button>
              </div>
            </form>

            {/* Active filters + stats */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-full px-3 py-1">
                <span className="font-medium text-slate-700">
                  {resultsCount}
                </span>{" "}
                results
              </div>
              {q ? (
                <span className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-full px-3 py-1">
                  Query: <strong className="ml-1 text-slate-800">{q}</strong>
                </span>
              ) : null}
              {category ? (
                <span className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-full px-3 py-1">
                  Category:{" "}
                  <strong className="ml-1 text-slate-800 capitalize">
                    {category}
                  </strong>
                </span>
              ) : null}
              {subCategory ? (
                <span className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-full px-3 py-1">
                  Sub Category:{" "}
                  <strong className="ml-1 text-slate-800 capitalize">
                    {subCategory}
                  </strong>
                </span>
              ) : null}
              {startYear || endYear ? (
                <span className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-full px-3 py-1">
                  Year Range:{" "}
                  <strong className="ml-1 text-slate-800 capitalize">
                    {startYear || "Any"} - {endYear || "Any"}
                  </strong>
                </span>
              ) : null}
              {(q || category || subCategory || startYear || endYear) && (
                <button
                  onClick={handleClearAll}
                  className="ml-auto text-slate-700 hover:text-slate-900 underline decoration-slate-300 hover:decoration-slate-500"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
