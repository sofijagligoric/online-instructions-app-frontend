import base from "./base.service";

const instance = base.service();


export const getAllAdverts = () => {
    return instance.get("/api/advert");
};


export const getAdvertsForInstructor = async (instructorId) => {
    const response = await instance.get(`/api/advert/instructor/${instructorId}`);
    return response.data;
};


export const addAdvert = (newAdvert) => {
    return instance.post("/api/advert", newAdvert);
};


export const editAdvert = (advertId, updatedAdvert) => {
    return instance.put(`/api/advert/edit/${advertId}`, updatedAdvert);
};


export const deleteAdvert = (advertId) => {
    return instance.delete(`/api/advert/${advertId}`);
};

export const getById = (id) =>
{
    return instance.get(`/api/advert/${id}`);
}

export default {
    getAllAdverts,
    getAdvertsForInstructor,
    addAdvert,
    editAdvert,
    deleteAdvert,
    getById
};