import base from "./base.service";

const instance = base.service();


export const getAllCategorys = () => {
    return instance.get("/api/category");
};


export const addCategory = (newCategory) => {
    return instance.post("/api/category", newCategory);
};


export const editCategory = (categoryId, updatedCategory) => {
    return instance.put(`/api/category/edit/${categoryId}`, updatedCategory);
};


export const deleteCategory = (categoryId) => {
    return instance.delete(`/api/category/${categoryId}`);
};

export const getById = (id) =>
{
    return instance.get(`/api/category/${id}`);
}

export default {
    getAllCategorys,
    addCategory,
    editCategory,
    deleteCategory,
    getById
};