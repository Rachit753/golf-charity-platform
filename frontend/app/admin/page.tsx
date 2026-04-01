"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import Navbar from "../../components/Navbar";

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

      setMessage("Draw executed successfully!");
      fetchData();
    } catch (err) {
      setMessage("Error running draw");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          Admin Dashboard
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

      {message && (
        <div className="mb-4 p-3 rounded-xl bg-green-600 text-white">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Total Users", value: data.totalUsers },
          { label: "Active Subscriptions", value: data.activeSubscriptions },
          { label: "Total Winners", value: data.totalWinners },
          { label: "Total Charities", value: data.totalCharities },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-gray-900/80 backdrop-blur p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-[1.02] transition duration-200"
          >
            <p className="text-gray-400">{item.label}</p>

            <h2 className="text-xl font-semibold tracking-wide">
              {item.value ?? 0}
            </h2>
          </div>
        ))}
      </div>

      <div className="bg-gray-900/80 backdrop-blur p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-[1.02] transition duration-200">
        <h2 className="text-xl font-semibold tracking-wide mb-4">
          Draw Control
        </h2>

        <button
          onClick={runDraw}
          disabled={loading}
          className={`bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-xl shadow hover:opacity-90 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Running..." : "Run Monthly Draw"}
        </button>
      </div>
    </div>
  );
}