import axios from "axios";

const baseConfig = {
  baseURL: "http://localhost:8080",
  withCredentials: true,
};
const baseService = {
  service: () => {
    const instance = axios.create(baseConfig);
    console.log("Base URL:", baseConfig.baseURL);

    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          console.warn("Error (401/403)");
        }
        return Promise.reject(error);
      }
    );

    instance.defaults.headers.common["Content-Type"] = "application/json";
    return instance;
  },
};
export default baseService;
