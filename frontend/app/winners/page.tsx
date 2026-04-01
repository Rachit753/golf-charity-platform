"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import Navbar from "../../components/Navbar";

export default function WinnersPage() {
  const [draws, setDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await API.get("/draw/history");
      setDraws(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />

      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Winners & Draw History
      </h1>

      {loading ? (
        <div className="animate-pulse text-gray-400">
          Loading data...
        </div>
      ) : draws.length === 0 ? (
        <p className="text-gray-500 italic">
          No data available yet
        </p>
      ) : (
        <div className="space-y-6">
          {draws.map((draw) => (
            <div
              key={draw.id}
              className="bg-gray-900/80 backdrop-blur p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-[1.02] transition duration-200"
            >
              <div className="mb-3">
                <h2 className="text-xl font-semibold tracking-wide">
                  {draw.draw_date}
                </h2>

                <p className="text-gray-400">
                  Numbers: {draw.numbers.join(", ")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-wide mb-2">
                  Winners:
                </h3>

                {draw.winners?.length > 0 ? (
                  draw.winners.map((w: any) => (
                    <div
                      key={w.id}
                      className="flex justify-between text-gray-300"
                    >
                      <span>{w.user?.name || "User"}</span>
                      <span>
                        {w.match_type} match — ₹{w.amount}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    No data available yet
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}