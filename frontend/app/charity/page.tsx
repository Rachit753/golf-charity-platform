"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function CharityPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const [percentage, setPercentage] = useState(10);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchCharities = async () => {
    try {
      const res = await API.get("/charities");
      setCharities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectCharity = async () => {
    try {
      if (!selected) {
        setMessage("Please select a charity first");
        return;
      }

      await API.post("/charities/select", {
        charity_id: selected,
        percentage,
      });

      setMessage("Charity selected!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage("Error selecting charity");
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <Navbar />
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Choose Your Charity
      </h1>

      {message && (
        <div className="mb-4 p-3 bg-green-600 rounded-xl">
          {message}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse text-gray-400">
          Loading data...
        </div>
      ) : charities.length === 0 ? (
        <p className="text-gray-500 italic">
          No data available yet
        </p>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {charities.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`p-4 rounded-2xl w-full text-left transition duration-200 hover:scale-[1.02] ${
                  selected === c.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                <h2 className="text-xl font-semibold tracking-wide">
                  {c.name}
                </h2>

                <p className="text-gray-400 text-sm">
                  {c.description}
                </p>
              </button>
            ))}
          </div>

          <div className="bg-gray-900/80 backdrop-blur p-6 rounded-2xl shadow-lg border border-gray-800 hover:scale-[1.02] transition duration-200">
            <label className="block mb-2 text-xl font-semibold tracking-wide">
              Contribution Percentage (%)
            </label>

            <input
              type="number"
              min={10}
              value={percentage}
              onChange={(e) =>
                setPercentage(Number(e.target.value))
              }
              className="w-full p-3 rounded-xl text-black outline-none"
            />
          </div>

          <button
            onClick={selectCharity}
            className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
          >
            Save Charity
          </button>
        </>
      )}
    </div>
  );
}