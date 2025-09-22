import Link from "next/link";

export function Header() {
  return (
    <header className="glass-header justify-between items-center p-4 mb-8 hidden lg:flex">
      <h1 className="text-3xl font-bold">NASA Bioscience</h1>
      <div className="flex items-center gap-4">
        <input type="text" placeholder="Search..." className="bg-transparent border border-gray-700 rounded px-3 py-2" />
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">New Project</button>
      </div>
    </header>
  );
}
