"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/dashboard/user");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Dashboard</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow text-black">
        <h2 className="font-semibold text-black">Subscription</h2>
        <p className="text-gray-700">Status: {data.subscription ? "Active" : "Inactive"}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow text-black">
        <h2 className="font-semibold text-black">Recent Scores</h2>
        {data.scores?.map((s: any) => (
          <p className="text-gray-700" key={s.id}>
            {s.score} ({s.date})
          </p>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow text-black">
        <h2 className="font-semibold text-black">Total Winnings</h2>
        <p className="text-gray-700">₹ {data.totalWinnings}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow text-black">
        <h2 className="font-semibold text-black">Your Charity</h2>
        {data.charity ? (
          <p className="text-gray-700">
            {data.charity.charities.name} ({data.charity.percentage}%)
          </p>
        ) : (
          <p className="text-gray-700">No charity selected</p>
        )}
      </div>
    </div>
  );
}
