export type VerificationStatus = "idle" | "verifying" | "success" | "error";
export type NetworkStatus = "online" | "offline" | "slow";

export interface VerificationResponse {
  success: boolean;
  message?: string;
}
