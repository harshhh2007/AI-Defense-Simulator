import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://vivaai-backend-9dwn.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error(
        "API Network Error:",
        error.message
      );
    } else {
      console.error(
        "API Request Error:",
        error.message
      );
    }

    return Promise.reject(error);
  }
);

export default api;