import base from "./base.service";

const instance = base.service(); 
/* 
const checkStatus = async () => {
    try {
      const response = await instance.get("/auth/status", {
        withCredentials: true
      });
      console.log("🟢 Backend response:", response.data);
      return response.data; 
    } catch (error) {
      return null;
    }
  }; */
const login = async (credentials) => {
    const response = await instance.post("/auth/login", credentials, {
        withCredentials: true, 
    });
    const data = response.data;

    // spremi token u localStorage
    if (data.token) {
        localStorage.setItem("token", data.token);
    }

    console.log('Login response data:', data);
    return data; 
};

const logout = async () => {
  localStorage.removeItem("token");
    return instance.post("/auth/custom-logout", {}, {
        withCredentials: true
    });
};

export default {
    login,
    logout,
    //checkStatus
};