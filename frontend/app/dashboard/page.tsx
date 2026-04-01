"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import ScoreForm from "../../components/ScoreForm";
import SubscribeButton from "../../components/SubscribeButton";
import Navbar from "../../components/Navbar";

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
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const refresh = async () => {
    try {
      const res = await API.get("/dashboard/user");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data)
    return (
      <div className="p-6 text-white">
        <div className="animate-pulse text-gray-400">
          Loading data...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <Navbar />

      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          User Dashboard
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2 rounded-xl shadow hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-900/80 backdrop-blur p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-[1.02] transition duration-200">
        <h2 className="text-xl font-semibold tracking-wide mb-2">
          💳 Subscription
        </h2>
        <p className="text-gray-300">
          Status: {data.subscription ? "Active" : "Inactive"}
        </p>
      </div>

      {!data.subscription && <SubscribeButton />}

      <ScoreForm refresh={refresh} />

      <div className="bg-gray-900/80 backdrop-blur p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-[1.02] transition duration-200">
        <h2 className="text-xl font-semibold tracking-wide mb-2">
          ⛳ Recent Scores
        </h2>

        {data.scores?.length > 0 ? (
          data.scores.map((s: any) => (
            <p key={s.id} className="text-gray-300">
              {s.score} ({s.date})
            </p>
          ))
        ) : (
          <p className="text-gray-500 italic">
            No data available yet
          </p>
        )}
      </div>

      <div className="bg-gray-900/80 backdrop-blur p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-[1.02] transition duration-200">
        <h2 className="text-xl font-semibold tracking-wide mb-2">
          Total Winnings
        </h2>

        <button
          onClick={() => (window.location.href = "/winners")}
          className="bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2 rounded-xl shadow hover:opacity-90 transition"
        >
          View Winners
        </button>

        <p className="text-green-400 text-xl font-bold mt-2">
          ₹ {data.totalWinnings}
        </p>
      </div>

      <div className="bg-gray-900/80 backdrop-blur p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-[1.02] transition duration-200">
        <h2 className="text-xl font-semibold tracking-wide mb-2">
          Your Charity
        </h2>

        <button
          onClick={() => (window.location.href = "/charity")}
          className="bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2 rounded-xl shadow hover:opacity-90 transition"
        >
          Select Charity
        </button>

        {data.charity ? (
          <p className="text-gray-300 mt-2">
            {data.charity.charities.name} (
            {data.charity.percentage}%)
          </p>
        ) : (
          <p className="text-gray-500 italic">
            No data available yet
          </p>
        )}
      </div>
    </div>
  );
}