import axios from "axios";

export const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const auth = {
  isLoggedIn: () => Boolean(localStorage.getItem("admin_token")),
  login: (token) => localStorage.setItem("admin_token", token),
  logout: () => localStorage.removeItem("admin_token")
};
