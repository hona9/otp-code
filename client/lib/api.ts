import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const verifyCode = async (code: string) => {
  const response = await api.post("/verify", { code });
  return response.data;
};

export default api;
