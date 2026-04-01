"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="flex flex-col items-center justify-center text-center h-screen px-6">
        <h1 className="text-5xl font-bold mb-6">
          Play Golf. Win Big. Give Back.
        </h1>

        <p className="text-gray-400 max-w-xl mb-8">
          Track your golf performance, participate in monthly draws,
          and contribute to meaningful charities — all in one platform.
        </p>

        <div className="space-x-4">
          <button
            onClick={() => router.push("/signup")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-xl"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/login")}
            className="border border-gray-500 px-6 py-3 rounded-xl"
          >
            Login
          </button>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="grid md:grid-cols-3 gap-6 p-10">
        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">⛳ Track Scores</h2>
          <p className="text-gray-400">
            Maintain your last 5 golf scores and improve your performance.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">🎲 Monthly Draws</h2>
          <p className="text-gray-400">
            Enter automated draws and win exciting cash rewards.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">❤️ Give Back</h2>
          <p className="text-gray-400">
            A portion of your subscription goes to your chosen charity.
          </p>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="text-center p-10">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Winning?
        </h2>

        <button
          onClick={() => router.push("/signup")}
          className="bg-green-500 px-8 py-3 rounded-xl"
        >
          Join Now
        </button>
      </div>

    </div>
  );
}