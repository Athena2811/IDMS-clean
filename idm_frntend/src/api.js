import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Attach access token
API.interceptors.request.use((req) => {
  const access = localStorage.getItem("access");
  if (access) {
    req.headers.Authorization = `Bearer ${access}`;
  }
  return req;
});

// Handle expired token
API.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh }
        );

        localStorage.setItem("access", res.data.access);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return API(originalRequest);
      } catch (err) {
        // Refresh failed → logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
