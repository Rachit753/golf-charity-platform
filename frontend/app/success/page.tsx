"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">

        <div className="text-green-500 text-6xl mb-4 animate-bounce">
          ✔
        </div>

        <h1 className="text-3xl font-bold mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-400 mb-4">
          Your subscription is now active 🎉
        </p>

        <p className="text-sm text-gray-500">
          Redirecting to dashboard in {count}s...
        </p>
      </div>
    </div>
  );
}