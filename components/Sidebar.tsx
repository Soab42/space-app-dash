// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import { HomeIcon } from "./icons/HomeIcon";
// import { UploadIcon } from "./icons/UploadIcon";
// import { ListIcon } from "./icons/ListIcon";
// import { SearchIcon } from "./icons/SearchIcon";

// export function Sidebar() {
//   const pathname = usePathname();
//   const [isOpen, setIsOpen] = useState(false);

//   const linkClass = (path: string) =>
//     `flex items-center gap-3 py-2 px-4 rounded hover:bg-white/10 ${pathname === path ? "bg-white/20" : ""}`;

//   const sidebarContent = (
//     <>
//       <div className="text-2xl font-bold mb-8">NASA Biosci</div>
//       <nav className="space-y-4">
//         <Link href="/" className={linkClass("/")} onClick={() => setIsOpen(false)}>
//           <HomeIcon className="w-5 h-5" />
//           <span>Home</span>
//         </Link>
//         <Link href="/upload" className={linkClass("/upload")} onClick={() => setIsOpen(false)}>
//           <UploadIcon className="w-5 h-5" />
//           <span>Upload</span>
//         </Link>
//         <Link href="/publications" className={linkClass("/publications")} onClick={() => setIsOpen(false)}>
//           <ListIcon className="w-5 h-5" />
//           <span>Browse</span>
//         </Link>
//         <Link href="/search" className={linkClass("/search")} onClick={() => setIsOpen(false)}>
//           <SearchIcon className="w-5 h-5" />
//           <span>Search</span>
//         </Link>
//       </nav>
//     </>
//   );

//   return (
//     <>
//       {/* Mobile header with hamburger menu */}
//       <div className="lg:hidden flex justify-between items-center p-4 glass-header">
//         <div className="text-2xl font-bold">NASA Biosci</div>
//         <button onClick={() => setIsOpen(!isOpen)}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <line x1="3" y1="12" x2="21" y2="12"/>
//             <line x1="3" y1="6" x2="21" y2="6"/>
//             <line x1="3" y1="18" x2="21" y2="18"/>
//           </svg>
//         </button>
//       </div>

//       {/* Sidebar */}
//       <aside className={`w-64 p-6 glass-card fixed lg:relative lg:translate-x-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-10 h-full`}>
//         {sidebarContent}
//       </aside>

//       {/* Overlay for mobile */}
//       {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-0" onClick={() => setIsOpen(false)}></div>}
//     </>
//   );
// }

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { HomeIcon } from "./icons/HomeIcon";
import { UploadIcon } from "./icons/UploadIcon";
import { ListIcon } from "./icons/ListIcon";
import { SearchIcon } from "./icons/SearchIcon";
import Image from "next/image";
// Elegant, professional glassmorphism sidebar
// - Mobile: slide-in drawer with overlay
// - Desktop: collapsible (mini) mode with icon-only rail, expandable on toggle
// - Accessible: aria-current, keyboard ESC to close on mobile, focus rings
// - Active route highlighting with subtle gradient

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop collapse

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // ESC to close mobile drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const nav = useMemo(
    () => [
      { href: "/", label: "Home", Icon: HomeIcon },
      { href: "/upload", label: "Upload", Icon: UploadIcon },
      { href: "/publications", label: "Browse", Icon: ListIcon },
      { href: "/search", label: "Search", Icon: SearchIcon },
      { href: "/categories", label: "Categories", Icon: ListIcon },
    ],
    []
  );

  const linkClass = (active: boolean) =>
    [
      "group flex items-center gap-3 rounded-2xl px-3 py-2 transition",
      "focus:outline-none focus:ring-2 focus:ring-slate-400/50",
      active
        ? "bg-white/30 border border-white/40 shadow-md shadow-slate-200/60 text-slate-900"
        : "hover:bg-white/20 border border-transparent text-slate-700 hover:text-slate-900",
    ].join(" ");

  const railWidth = collapsed ? "w-20" : "w-72";

  const SidebarInner = (
    <div className="h-[calc(100%-3rem)] xl:h-full flex flex-col">
      {/* Brand */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-2xl">
        {collapsed ? null : (
          <Link href="/" className="flex items-center gap-2">
            {/* <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400/70 to-indigo-400/70 shadow-md shadow-sky-200/40 grid place-items-center">
            <span className="text-white font-semibold">G</span>
          </div>
          {!collapsed && (
            <span className="text-xl font-semibold tracking-tight text-slate-900">Genexa</span>
          )} */}
            <Image
              src="/genexa_logo.png"
              width={100}
              height={100}
              alt="Genexa Logo"
              className="rounded-2xl w-full"
            />
          </Link>
        )}
        {/* Collapse toggle (desktop only) */}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:inline-flex items-center justify-center h-9 w-9 min-w-9 rounded-xl bg-slate-700/40 hover:bg-slate-900/60 border border-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {collapsed ? (
              <path d="M9 5l7 7-7 7" />
            ) : (
              <path d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="space-y-2">
        {nav.map(({ href, label, Icon }) => {
          const active =
            pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={linkClass(active)}
            >
              <Icon className="h-5 w-5 min-w-5 min-h-5 shrink-0 text-slate-600 group-hover:text-slate-800" />
              {!collapsed && <span className="truncate">{label}</span>}
              {/* Active indicator pill */}
              {active && (
                <span
                  className="ml-auto h-2 w-2 rounded-full bg-slate-900/80"
                  aria-hidden
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / version */}
      <div className="mt-auto pt-6 text-xs text-slate-500">
        {!collapsed ? (
          <div className="rounded-2xl bg-white/40 border border-white/50 p-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span>Online</span>
              <span className="ml-auto text-slate-400">v1.0</span>
            </div>
          </div>
        ) : (
          <div className="grid place-items-center">
            <span className="text-slate-400">v1.0</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header with hamburger */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 backdrop-blur-xl bg-white/60 border-b border-white/30">
        <div className="flex items-center gap-2">
          <Image
            src="/genexa_logo.png"
            width={100}
            height={100}
            alt="Genexa Logo"
            className="rounded-2xl"
          />
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-10 w-10 grid place-items-center rounded-xl bg-slate-900/50 hover:bg-slate-900/70 border border-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50"
          aria-label="Open navigation"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block ${railWidth} shrink-0 h-[calc(100vh-0px)] sticky top-0  ${
          collapsed ? "p-2" : "p-4"
        }`}
        aria-label="Primary"
      >
        <div className="h-full rounded-3xl backdrop-blur-2xl bg-white/50 border border-white/40 shadow-2xl shadow-slate-200/70 p-2">
          {SidebarInner}
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${
          open ? "" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Scrim */}
        <button
          type="button"
          className={`absolute inset-0 bg-slate-900/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />

        {/* Panel */}
        <div
          className={`absolute top-0 left-0 h-full ${railWidth} p-4 transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="h-full rounded-3xl backdrop-blur-2xl bg-white/60 border border-white/40 shadow-2xl shadow-slate-200/70 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-900">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-xl bg-slate-900/50 hover:bg-black/70 border border-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                aria-label="Close navigation"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>
            {SidebarInner}
          </div>
        </div>
      </div>
    </>
  );
}
