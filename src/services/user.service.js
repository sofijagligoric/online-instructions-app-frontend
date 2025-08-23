import base from "./base.service";

const instance = base.service();

export const getAllUsers = async () => {
  try {
    const accountResponse = await instance.get("/api/account");
    const accounts = accountResponse.data;

    // filter odmah samo instruktore i studente
    const userAccounts = accounts.filter(acc => 
      acc.type.toLowerCase() === "instructor" || acc.type.toLowerCase() === "student"
    );

    // za svaki nalog dohvatimo User detalje
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
          // Ako ne postoji User zapis, vraćamo prazne vrijednosti
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

export default { getAllUsers, getUserById };