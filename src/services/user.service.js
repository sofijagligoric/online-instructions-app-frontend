import base from "./base.service";

const instance = base.service();

export const getAllUsers = async () => {
  try {
    const accountResponse = await instance.get("/api/account");
    const accounts = accountResponse.data;
 
    const userPromises = accounts.map(async (acc) => {
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
      } catch (error) {
        console.error("Error fetching user details for account", acc.id, error);
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
    });

    const users = await Promise.all(userPromises);

    // filter samo instruktore i studente
    return users.filter((u) => u.type === "instructor" || u.type === "student");
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

export default { getAllUsers };