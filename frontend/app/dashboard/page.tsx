"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import ScoreForm from "../../components/ScoreForm";
import SubscribeButton from "../../components/SubscribeButton";

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
  

  if (!data) return <p className="p-6 text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Dashboard</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* SUBSCRIPTION */}
      <div className="bg-gray-900 p-5 rounded-xl shadow">
        <h2 className="font-semibold text-lg mb-2">💳 Subscription</h2>
        <p className="text-gray-300">
          Status: {data.subscription ? "Active" : "Inactive"}
        </p>
      </div>

      {/* SUBSCRIBE BUTTON */}
      {!data.subscription && <SubscribeButton />}

      {/* SCORE FORM */}
      <ScoreForm refresh={refresh} />

      {/* SCORES */}
      <div className="bg-gray-900 p-5 rounded-xl shadow">
        <h2 className="font-semibold text-lg mb-2">⛳ Recent Scores</h2>

        {data.scores?.length > 0 ? (
          data.scores.map((s: any) => (
            <p key={s.id} className="text-gray-300">
              {s.score} ({s.date})
            </p>
          ))
        ) : (
          <p className="text-gray-500">No scores yet</p>
        )}
      </div>

      {/* WINNINGS */}
      <div className="bg-gray-900 p-5 rounded-xl shadow">
        <h2 className="font-semibold text-lg mb-2">🏆 Total Winnings</h2>

        <button
          onClick={() => (window.location.href = "/winners")}
          className="bg-yellow-500 px-4 py-2 rounded-lg">
          View Winners
        </button>
        
        <p className="text-green-400 text-xl font-bold">
          ₹ {data.totalWinnings}
        </p>
      </div>

      {/* CHARITY */}
      <div className="bg-gray-900 p-5 rounded-xl shadow">
        <h2 className="font-semibold text-lg mb-2">❤️ Your Charity</h2>

        <button
          onClick={() => (window.location.href = "/charity")}
          className="bg-pink-500 px-4 py-2 rounded-lg">
          Select Charity
        </button>

        {data.charity ? (
          <p className="text-gray-300">
            {data.charity.charities.name} (
            {data.charity.percentage}%)
          </p>
        ) : (
          <p className="text-gray-500">No charity selected</p>
        )}
      </div>
    </div>
  );
}