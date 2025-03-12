"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

export default function Success() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div
        className={`w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-center transition-all duration-100 transform
        ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <div className="mb-4 relative">
          <div
            className={`mx-auto h-24 w-24 relative transition-transform duration-100 ease-out
            ${mounted ? "scale-100" : "scale-0"}`}
          >
            {/* White checkmark using Heroicons */}
            <CheckBadgeIcon className="relative z-10 h-full w-full text-green-300 p-3" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Verification Successful!
        </h2>

        <p className="text-gray-600 mb-8 opacity-80">
          Your code has been successfully verified.
        </p>

        <button
          onClick={() => {
            setMounted(false);
            setTimeout(() => router.push("/"), 200);
          }}
          className="w-full py-3 rounded-lg text-white font-semibold
            bg-blue-600 hover:bg-blue-700 active:bg-blue-800
            transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Back to Verification
        </button>
      </div>
    </div>
  );
}
