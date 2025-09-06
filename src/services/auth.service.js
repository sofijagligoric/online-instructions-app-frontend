import base from "./base.service";

const instance = base.service();

const login = async (credentials) => {
  const response = await instance.post("/auth/login", credentials, {
    withCredentials: true,
  });
  const data = response.data;
  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  console.log("Login response data:", data);
  return data;
};

const logout = async () => {
  localStorage.removeItem("token");
  return instance.post(
    "/auth/custom-logout",
    {},
    {
      withCredentials: true,
    }
  );
};

export default {
  login,
  logout,
};
