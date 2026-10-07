import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let csrfToken = "";

export const setCsrfToken = (token?: string) => {
  csrfToken = token || "";
};

api.interceptors.request.use(async (config) => {
  if (config.method && ["post", "put", "patch", "delete"].includes(config.method.toLowerCase())) {
    if (!csrfToken) {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/csrf-token`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        csrfToken = data.csrfToken || "";
      }
    }

    if (csrfToken) {
      config.headers.set("X-CSRF-Token", csrfToken);
    }
  }

  return config;
});