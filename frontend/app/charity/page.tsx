"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import { useRouter } from "next/navigation";

export default function CharityPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const [percentage, setPercentage] = useState(10);
  const [message, setMessage] = useState("");

  const fetchCharities = async () => {
    try {
      const res = await API.get("/charities");
      setCharities(res.data);
    } catch (err) {
      console.error(err);
    }
  };


const router = useRouter();

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
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Choose Your Charity 
      </h1>

      {/* MESSAGE */}
      {message && (
        <div className="mb-4 p-3 bg-green-600 rounded">
          {message}
        </div>
      )}

      {/* CHARITY LIST */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
  {charities.map((c) => (
    <button
      key={c.id}
      onClick={() => {
        console.log("Selected:", c.id);
        setSelected(c.id);
      }}
      className={`p-4 rounded-xl w-full text-left transition ${
        selected === c.id
          ? "bg-blue-500"
          : "bg-gray-900 hover:bg-gray-800"
      }`}
    >
      <h2 className="font-semibold">{c.name}</h2>
      <p className="text-gray-400 text-sm">
        {c.description}
      </p>
    </button>
  ))}
</div>

      {/* PERCENTAGE */}
      <div className="bg-gray-900 p-4 rounded-xl mb-4">
        <label className="block mb-2">
          Contribution Percentage (%)
        </label>

        <input
          type="number"
          min={10}
          value={percentage}
          onChange={(e) =>
            setPercentage(Number(e.target.value))
          }
          className="w-full p-2 rounded text-black"
        />
      </div>

      {/* BUTTON */}
      <button
  onClick={() => {
    console.log("Button clicked");
    selectCharity();
  }}
  className="bg-green-500 px-6 py-3 rounded-xl hover:bg-green-600"
>
  Save Charity
</button>
    </div>
  );
}