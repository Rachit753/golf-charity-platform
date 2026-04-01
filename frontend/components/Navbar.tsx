"use client";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-xl font-bold">⛳ Golf Charity</h1>

      <div className="space-x-4">
        <a href="/dashboard" className="hover:text-gray-300">
          Dashboard
        </a>
        <a href="/charity" className="hover:text-gray-300">
          Charity
        </a>
        <a href="/winners" className="hover:text-gray-300">
          Winners
        </a>
      </div>
    </div>
  );
}