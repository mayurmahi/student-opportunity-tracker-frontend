import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/users/me");
export const updateInterests = (data) => API.patch("/users/me/interests", data);

export const getOpportunities = (category, search) => {
  const params = {};
  if (category) params.category = category;
  if (search) params.search = search;
  return API.get("/opportunities/", { params });
};


export const getRecommended = () => API.get("/opportunities/recommended");
export const createOpportunity = (data) => API.post("/opportunities/", data);
export const deleteOpportunity = (id) => API.delete(`/opportunities/${id}`);