"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const res = await API.get("/dashboard/admin");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const runDraw = async () => {
    try {
      setLoading(true);
      setMessage("");

      await API.post("/draw/run");

      setMessage("🎉 Draw executed successfully!");
      fetchData();
    } catch (err) {
      setMessage("❌ Error running draw");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <p className="p-6 text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* SUCCESS / ERROR MESSAGE */}
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-600 text-white">
          {message}
        </div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <p className="text-gray-400">Total Users</p>
          <h2 className="text-2xl font-bold">{data.totalUsers}</h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <p className="text-gray-400">Active Subscriptions</p>
          <h2 className="text-2xl font-bold">
            {data.activeSubscriptions}
          </h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <p className="text-gray-400">Total Winners</p>
          <h2 className="text-2xl font-bold">
            {data.totalWinners}
          </h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <p className="text-gray-400">Total Charities</p>
          <h2 className="text-2xl font-bold">
            {data.totalCharities}
          </h2>
        </div>
      </div>

      {/* DRAW CONTROL */}
      <div className="bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          🎲 Draw Control
        </h2>

        <button
          onClick={runDraw}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90"
        >
          {loading ? "Running..." : "Run Monthly Draw"}
        </button>
      </div>
    </div>
  );
}