import { useState, useCallback, RefObject } from "react";
import { useMutation } from "@tanstack/react-query";
import { verifyCode } from "@/lib/api";
import type { VerificationStatus } from "@/types";

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
