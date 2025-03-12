"use client";
import { useRef } from "react";
import { useVerification } from "@/hooks/useVerification";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import type { VerificationStatus } from "@/types";

interface VerificationFormProps {
  onSuccess: () => void;
  onStatusChange: (status: VerificationStatus) => void;
}

export function VerificationForm({
  onSuccess,
  onStatusChange,
}: VerificationFormProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const networkStatus = useNetworkStatus();

  const {
    code,
    setCode,
    error,
    errorMessage,
    verificationStatus,
    isLoading,
    isError,
    handleSubmit,
    handleChange,
    handleKeyDown,
    handlePaste,
  } = useVerification({
    onSuccess,
    onStatusChange,
    inputRefs,
  });

  return (
    <div
      className={`w-full transition-all duration-300 ${
        verificationStatus === "success" ? "scale-105 opacity-0" : ""
      }`}
    >
      {verificationStatus === "success" ? (
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-16 h-16 text-green-500 animate-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      ) : (
        <>
          <p className="text-gray-600 text-center mb-8">
            Please enter the 6-digit code sent to your device
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="flex gap-2 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg 
                    ${
                      error && !digit
                        ? "border-red-500 bg-red-50 text-red-900"
                        : "border-gray-300 focus:border-blue-500 text-gray-900"
                    }
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-200
                    ${digit ? "bg-gray-50" : "bg-white"}
                    tracking-wider
                  `}
                  disabled={isLoading}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {(error || isError) && (
              <p className="text-red-500 text-sm mb-4 animate-shake">
                {errorMessage}
              </p>
            )}

            {networkStatus !== "online" && (
              <div
                className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-md text-sm text-center"
                role="alert"
              >
                {networkStatus === "offline"
                  ? "You appear to be offline. Please check your connection."
                  : "Your connection seems slow. Verification might take longer."}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || code.includes("")}
              className={`w-full py-3 rounded-lg text-white font-semibold
                ${
                  isLoading || code.includes("")
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                }
                transition-all duration-200 shadow-md hover:shadow-lg
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
