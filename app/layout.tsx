import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NASA Bioscience Dashboard",
  description: "A modern dashboard for NASA hackathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* <div className="stars"></div> */}
        {/* <div className="twinkling"></div> */}
        <div className="relative flex flex-col lg:flex-row h-screen text-white bg-gradient-to-br from-slate-100 via-slate-100 to-slate-200">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}