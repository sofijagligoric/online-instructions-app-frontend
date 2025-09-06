import base from "./base.service";

const instance = base.service();

export const getAll = () => {
  return instance.get("/api/account");
};

export const deactivateAccount = (id) => {
  return instance.put(`/api/account/${id}/deactivate`);
};

export const activateAccount = (id) => {
  return instance.put(`/api/account/${id}/activate`);
};

export const updateAccount = (id, updatedAccount) => {
  return instance.put(`/api/account/edit/${id}`, updatedAccount);
};

export const addAccount = (newAccount) => {
  return instance.post("/api/account", newAccount);
};

export const getById = (id) => {
  return instance.get(`/api/account/${id}`);
};

export const getByUsername = (username) => {
  return instance.get(`/api/account/username/${username}`);
};

export const passwordChange = (id, passwordDTO) => {
  return instance.put(`/api/account/edit/changePassword/${id}`, passwordDTO);
};

export const createUser = (userAccountDTO) => {
  return instance.post("/api/user", userAccountDTO);
};

export const createStudent = (studentDTO) => {
  return instance.post("/api/student", studentDTO);
};

export const createInstructor = (instructorDTO) => {
  return instance.post("/api/instructor", instructorDTO);
};

const checkUsername = (username) => {
  return instance.get(`/api/account/username/${username}`);
};

export const forgotPassword = (email) => {
  return instance.put("/login/forgotPassword", email, {
    headers: { "Content-Type": "text/plain" }
  });
};

export default {
  getAll,
  deactivateAccount,
  activateAccount,
  addAccount,
  getById,
  getByUsername,
  updateAccount,
  passwordChange,
  createUser,
  createStudent,
  createInstructor,
  checkUsername,
  forgotPassword
};
