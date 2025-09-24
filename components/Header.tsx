import Link from "next/link";

export function Header() {
  return (
    <header className="hidden lg:flex items-center justify-between px-6 py-4 mb-8 backdrop-blur-xl bg-white/60 border border-white/30 shadow-md shadow-slate-200/60 rounded-3xl mx-2 mt-2">
      {/* Branding */}
      <Link href="/" className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Bioscience Future Library
        </h1>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link href="/search">
          <div className="relative">
            <input
              type="text"
              placeholder="Search…"
              className="pl-10 pr-4 py-2.5 rounded-2xl bg-white/60 border border-white/40 shadow-inner shadow-slate-200/40 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="h-4 w-4 text-slate-400"
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
          </div>
        </Link>
        <Link href="/upload">
          <button className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-medium shadow-lg shadow-slate-900/25 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/60 transition">
            New Project
          </button>
        </Link>
      </div>
    </header>
  );
}
