"use client";

import { useState } from "react";
import API from "../lib/api";

export default function ScoreForm({ refresh }: any) {
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const addScore = async () => {
    try {
      setLoading(true);

      await API.post("/scores/add", {
        score: Number(score),
        date,
      });

      setScore("");
      setDate("");
      refresh(); 
    } catch (err) {
      alert("Error adding score");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl text-white">
      <h2 className="mb-3 font-semibold">⛳ Add Score</h2>

      <input
        type="number"
        placeholder="Score (1-45)"
        className="w-full p-2 mb-3 rounded text-black"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-2 mb-3 rounded text-black"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button
        onClick={addScore}
        disabled={loading}
        className="bg-green-500 px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add Score"}
      </button>
    </div>
  );
}