import base from "./base.service";

const instance = base.service();

export const getAllUsers = async () => {
  try {
    const accountResponse = await instance.get("/api/account");
    const accounts = accountResponse.data;

    const userAccounts = accounts.filter(
      (acc) =>
        acc.type.toLowerCase() === "instructor" ||
        acc.type.toLowerCase() === "student"
    );

    const users = await Promise.all(
      userAccounts.map(async (acc) => {
        try {
          const userResponse = await instance.get(`/api/user/${acc.id}`);
          const user = userResponse.data;
          return {
            id: acc.id,
            username: acc.username,
            type: acc.type.toLowerCase(),
            isActive: acc.isActive,
            dateCreated: acc.created,
            firstName: user.fName || "",
            lastName: user.lName || "",
            email: user.email || "",
            phone: user.phone || null,
          };
        } catch {
          return {
            id: acc.id,
            username: acc.username,
            type: acc.type.toLowerCase(),
            isActive: acc.isActive,
            dateCreated: acc.created,
            firstName: "",
            lastName: "",
            email: "",
            phone: null,
          };
        }
      })
    );

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const accountResponse = await instance.get(`/api/account/${id}`);
    const acc = accountResponse.data;

    if (acc.type.toLowerCase() === "admin") return null;
    const userResponse = await instance.get(`/api/user/${id}`);
    const user = userResponse.data;

    return {
      id: acc.id,
      username: acc.username,
      type: acc.type.toLowerCase(),
      isActive: acc.isActive,
      dateCreated: acc.created,
      firstName: user.fName || "",
      lastName: user.lName || "",
      email: user.email || "",
      phone: user.phone || null,
    };
  } catch (error) {
    console.error("Error fetching user by id:", error);
    return null;
  }
};

export const getAllInstructors = async () => {
  try {
    const instResponse = await instance.get("/api/instructor");
    const instructors = instResponse.data;

    return Promise.all(
      instructors.map(async (inst) => {
        try {
          const accountResponse = await instance.get(
            `/api/account/${inst.Account_Id}`
          );
          const acc = accountResponse.data;

          const userResponse = await instance.get(
            `/api/user/${inst.Account_Id}`
          );
          const user = userResponse.data;

          return {
            id: acc.id,
            username: acc.username,
            type: "instructor",
            isActive: acc.isActive,
            dateCreated: acc.created,
            firstName: user.fName || "",
            lastName: user.lName || "",
            email: user.email || "",
            phone: user.phone || null,
            description: inst.description || "",
          };
        } catch (err) {
          console.error("Error merging instructor data:", err);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw error;
  }
};

export const getInstructorById = async (id) => {
  try {
    const accountResponse = await instance.get(`/api/account/${id}`);
    const acc = accountResponse.data;

    const userResponse = await instance.get(`/api/user/${id}`);
    const user = userResponse.data;
    const instResponse = await instance.get(`/api/instructor/${id}`);
    const inst = instResponse.data;

    return {
      id: acc.id,
      username: acc.username,
      type: "instructor",
      isActive: acc.isActive,
      dateCreated: acc.created,
      firstName: user.fName || "",
      lastName: user.lName || "",
      email: user.email || "",
      phone: user.phone || null,
      description: inst.description || "",
    };
  } catch (error) {
    console.error("Error fetching instructor by id:", error);
    return null;
  }
};

export const updateUser = (id, updatedUser) => {
  return instance.put(`/api/user/edit/${id}`, updatedUser);
};
export default {
  getAllUsers,
  getUserById,
  getAllInstructors,
  getInstructorById,
  updateUser,
};
