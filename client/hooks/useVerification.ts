import { useState, useCallback, RefObject } from "react";
import { useMutation } from "@tanstack/react-query";
import { verifyCode } from "@/lib/api";
import type { VerificationStatus } from "@/types";
import axios, { AxiosError } from "axios";

interface UseVerificationProps {
  onSuccess: () => void;
  inputRefs: RefObject<(HTMLInputElement | null)[]>;
  onStatusChange: (status: VerificationStatus) => void;
}

export function useVerification({
  onSuccess,
  onStatusChange,
  inputRefs,
}: UseVerificationProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("idle");

  const verifyCodeMutation = useMutation({
    mutationFn: async (verificationCode: string) => {
      setVerificationStatus("verifying");
      onStatusChange("verifying");
      return await verifyCode(verificationCode);
    },
    onSuccess: async (data) => {
      if (data.status === "success") {
        setVerificationStatus("success");
        onStatusChange("success");
        await new Promise((resolve) => setTimeout(resolve, 400));
        onSuccess();
      }
    },
    onError: (error: unknown) => {
      setVerificationStatus("error");
      onStatusChange("error");
      setError(true);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          setErrorMessage(
            axiosError.response.data?.message ||
              "Invalid verification code. Please try again."
          );
        } else if (axiosError.request) {
          setErrorMessage("Internal server error. Please try again later.");
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      } else {
        setErrorMessage("Internal server error. Please try again later.");
      }
    },
  });

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
    // Allow direct number input
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault(); // Prevent default to handle it ourselves
      const newCode = [...code];
      newCode[index] = e.key;
      setCode(newCode);
      setError(false);

      // Move to next input if not the last digit
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      return;
    }

    // Handle other keys
    if (e.key === "Backspace") {
      if (!code[index]) {
        e.preventDefault();
        if (index > 0) {
          const newCode = [...code];
          newCode[index - 1] = "";
          setCode(newCode);
          inputRefs.current[index - 1]?.focus();
        }
      } else {
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

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    // Prevent the default paste behavior
    event.preventDefault();

    let pastedData: string;

    // Handle both clipboard API and mobile paste events
    if (event.clipboardData) {
      pastedData = event.clipboardData.getData("text");
    } else {
      // Fallback for mobile devices
      pastedData =
        (event as any).nativeEvent?.clipboardData?.getData("text") || "";
    }

    // Clean the pasted data: remove non-digits and limit to 6 characters
    const cleanedData = pastedData.replace(/\D/g, "").slice(0, 6);

    // Only proceed if we have exactly 6 digits
    if (cleanedData.length === 6) {
      const newCode = cleanedData.split("");
      setCode(newCode);
      setError(false);
      // Focus the last input after successful paste
      inputRefs.current[5]?.focus();
    } else if (cleanedData.length > 0) {
      // If we have some valid digits but not 6, fill what we can
      const newCode = [...code];
      cleanedData.split("").forEach((digit, index) => {
        if (index < 6) {
          newCode[index] = digit;
        }
      });
      setCode(newCode);
      setError(false);
      // Focus the next empty input or the last input
      const nextEmptyIndex = newCode.findIndex((digit) => digit === "");
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (code.includes("")) {
      setError(true);
      setErrorMessage("Please fill in all digits.");
      inputRefs.current[code.findIndex((digit) => digit === "")]?.focus();
      return;
    }

    verifyCodeMutation.mutate(code.join(""));
  };

  return {
    code,
    setCode,
    error,
    errorMessage,
    verificationStatus,
    isLoading: verifyCodeMutation.isPending,
    isError: verifyCodeMutation.isError,
    handleSubmit,
    handleChange,
    handleKeyDown,
    handlePaste,
  };
}
