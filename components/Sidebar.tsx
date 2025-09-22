"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HomeIcon } from "./icons/HomeIcon";
import { UploadIcon } from "./icons/UploadIcon";
import { ListIcon } from "./icons/ListIcon";
import { SearchIcon } from "./icons/SearchIcon";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = (path: string) =>
    `flex items-center gap-3 py-2 px-4 rounded hover:bg-white/10 ${pathname === path ? "bg-white/20" : ""}`;

  const sidebarContent = (
    <>
      <div className="text-2xl font-bold mb-8">NASA Biosci</div>
      <nav className="space-y-4">
        <Link href="/" className={linkClass("/")} onClick={() => setIsOpen(false)}>
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link href="/upload" className={linkClass("/upload")} onClick={() => setIsOpen(false)}>
          <UploadIcon className="w-5 h-5" />
          <span>Upload</span>
        </Link>
        <Link href="/publications" className={linkClass("/publications")} onClick={() => setIsOpen(false)}>
          <ListIcon className="w-5 h-5" />
          <span>Browse</span>
        </Link>
        <Link href="/search" className={linkClass("/search")} onClick={() => setIsOpen(false)}>
          <SearchIcon className="w-5 h-5" />
          <span>Search</span>
        </Link>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile header with hamburger menu */}
      <div className="lg:hidden flex justify-between items-center p-4 glass-header">
        <div className="text-2xl font-bold">NASA Biosci</div>
        <button onClick={() => setIsOpen(!isOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-64 p-6 glass-card fixed lg:relative lg:translate-x-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-10 h-full`}>
        {sidebarContent}
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-0" onClick={() => setIsOpen(false)}></div>}
    </>
  );
}