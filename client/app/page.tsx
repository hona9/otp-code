"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { VerificationForm } from "@/components/forms/VerificationForm";
import type { VerificationStatus } from "@/types";

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>("idle");

  const handleSuccess = () => {
    router.replace("/success");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {status === "success" ? "Code Verified!" : "Verify Your Account"}
        </h2>
        <VerificationForm
          onSuccess={handleSuccess}
          onStatusChange={setStatus}
        />
      </div>
    </div>
  );
}
