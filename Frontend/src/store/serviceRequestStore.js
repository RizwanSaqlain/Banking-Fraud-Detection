import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/service-requests"
    : "/api/service-requests";

export const useServiceRequestStore = create((set) => ({
  requests: [],
  isLoading: false,
  error: null,

  fetchMyServiceRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/my`, { withCredentials: true });
      set({ requests: response.data.requests, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch service requests",
        isLoading: false,
      });
    }
  },
})); 