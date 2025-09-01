import axios from "axios";
import environment from "../enviroments"; 
import {Modal, message} from "antd";



const baseConfig = {
  baseURL: "http://localhost:8080", 
  withCredentials: true,
};
const baseService = {
  service: () => {
   // const config = environment();
    const instance = axios.create(baseConfig);
console.log("Base URL:", baseConfig.baseURL);

    instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ili sessionStorage
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
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.warn("Sesija istekla (401/403)");
          message.warning("Sesija istekla. Molimo vas da se ponovo prijavite.");
        //  window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );



    instance.defaults.headers.common["Content-Type"] = "application/json";
    return instance;
  },
};
export default baseService;