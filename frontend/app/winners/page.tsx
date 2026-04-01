"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";

export default function WinnersPage() {
  const [draws, setDraws] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await API.get("/draw/history");
      setDraws(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Winners & Draw History
      </h1>

      {draws.length === 0 ? (
        <p className="text-gray-400">No draws yet</p>
      ) : (
        <div className="space-y-6">
          {draws.map((draw) => (
            <div
              key={draw.id}
              className="bg-gray-900 p-5 rounded-xl"
            >
              {/* DRAW INFO */}
              <div className="mb-3">
                <h2 className="font-semibold">
                  {draw.draw_date}
                </h2>

                <p className="text-gray-400">
                  Numbers: {draw.numbers.join(", ")}
                </p>
              </div>

              {/* WINNERS */}
              <div>
                <h3 className="font-semibold mb-2">
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
                  <p className="text-gray-500">
                    No winners
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