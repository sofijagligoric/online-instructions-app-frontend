import base from "./base.service";

const instance = base.service();

export const getAll = () => {
    return instance.get("/api/account");
};

export const deactivateAccount = (id) =>
{
    return instance.delete(`/api/account/${id}/deactivate`);
}

export const activateAccount = (id) =>
{
    return instance.delete(`/api/account/${id}/activate`);
}

export const updateAccount = (id, updatedAccount) =>
    {
        return instance.put(`/api/account/edit/${id}`, updatedAccount);
    }

export const addAccount = (newAccount) =>
{
    return instance.post("/api/account", newAccount);
}

export const getById = (id) =>
{
    return instance.get(`/api/account/${id}`);
}

export const getByUsername = (username) =>
    {
        return instance.get(`/api/account/username/${username}`);
    }

export default
{
    getAll,deactivateAccount, activateAccount, addAccount, getById, getByUsername, updateAccount
};