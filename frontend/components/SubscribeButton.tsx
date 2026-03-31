"use client";

import API from "../lib/api";

export default function SubscribeButton() {
  const subscribe = async (priceId: string) => {
    try {
      const res = await API.post(
        "/subscription/create-checkout-session",
        { priceId }
      );

      window.location.href = res.data.url;
    } catch (err) {
      alert("Subscription error");
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl text-white mt-4">
      <h2 className="mb-3 font-semibold">💳 Subscribe</h2>

      <button
        onClick={() =>
          subscribe("price_1TGw8LRpw8g6nRbweIDCJAcn")
        }
        className="bg-blue-500 px-4 py-2 rounded mr-2"
      >
        Monthly Plan
      </button>

      <button
        onClick={() =>
          subscribe("price_1TGw9FRpw8g6nRbwgpZidUSU")
        }
        className="bg-purple-500 px-4 py-2 rounded"
      >
        Yearly Plan
      </button>
    </div>
  );
}