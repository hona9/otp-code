"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash/debounce";

export default function Home() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL || "";

  // TanStack Query mutation
  const verifyCodeMutation = useMutation({
    mutationFn: async (verificationCode: string) => {
      const response = await axios.post(`${api}/verify`, {
        code: verificationCode,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      if (data.status === "success") {
        setVerificationStatus("success");

        router.replace("/success");
      }
    },
    onError: (error: any) => {
      setVerificationStatus("error");
      setError(true);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setErrorMessage(
        error.response?.data?.message ||
          "Invalid verification code. Please try again."
      );
    },
  });

  // Add verification status state
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");

  // Add state for error message
  const [errorMessage, setErrorMessage] = useState<string>(
    "Invalid verification code. Please try again."
  );

  // Create a debounced version of the mutation
  const debouncedMutation = useCallback(
    debounce((verificationCode: string) => {
      verifyCodeMutation.mutate(verificationCode);
    }, 300),
    [] // Empty dependency array since we don't want to recreate the debounced function
  );

  // Cleanup the debounced function when component unmounts
  useEffect(() => {
    return () => {
      debouncedMutation.cancel();
    };
  }, [debouncedMutation]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!code[index]) {
        // Move to previous field on backspace if current field is empty
        e.preventDefault();
        if (index > 0) {
          const newCode = [...code];
          newCode[index - 1] = "";
          setCode(newCode);
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Clear current field
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pastedData = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData.length === 6) {
      const newCode = pastedData.split("");
      setCode(newCode);
      setError(false);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (code.includes("")) {
      setError(true);
      setErrorMessage("Please fill in all digits.");
      inputRefs.current[code.findIndex((digit) => digit === "")]?.focus();
      return;
    }

    // Use the debounced mutation instead of direct mutation
    debouncedMutation(code.join(""));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div
        className={`w-full max-w-md p-8 bg-white rounded-xl shadow-lg transition-all duration-500 ${
          verificationStatus === "success" ? "scale-105 opacity-0" : ""
        }`}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {verificationStatus === "success"
            ? "Code Verified!"
            : "Enter Verification Code"}
        </h2>

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

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center"
            >
              <div className="flex gap-2 mb-6">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
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
                    disabled={verifyCodeMutation.isPending}
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>

              {(error || verifyCodeMutation.isError) && (
                <p className="text-red-500 text-sm mb-4 animate-shake">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={verifyCodeMutation.isPending || code.includes("")}
                className={`w-full py-3 rounded-lg text-white font-semibold
                  ${
                    verifyCodeMutation.isPending || code.includes("")
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                  }
                  transition-all duration-200 shadow-md hover:shadow-lg
                `}
              >
                {verifyCodeMutation.isPending ? (
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
    </div>
  );
}
