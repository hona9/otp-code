import { useState, useEffect } from "react";

type NetworkStatusType = "online" | "offline" | "slow";

export function useNetworkStatus(): NetworkStatusType {
  const [status, setStatus] = useState<NetworkStatusType>("online");

  useEffect(() => {
    const handleOnline = () => setStatus("online");
    const handleOffline = () => setStatus("offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return status;
}
