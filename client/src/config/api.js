const rawApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://smart-study-planner-with-deadline-tracker.onrender.com";

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");
export const API_URL = `${API_BASE_URL}/api`;
