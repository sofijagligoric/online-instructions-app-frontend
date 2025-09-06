import base from "./base.service";

const instance = base.service();

export const getAllResources = () => {
    return instance.get("/api/resource");
};


export const getResourceById = (id) => {
    return instance.get(`/api/resource/${id}`);
};

export const getResourcesForUser = async (id) => {
    const response = await instance.get(`/api/resource/user/${id}`);
    return response.data;
};



export const addResource = (newResource) => {
    return instance.post("/api/resource", newResource);
};


export const editResource = (resourceId, updatedResource) => {
    return instance.put(`/api/resource/${resourceId}`, updatedResource);
};


export const deleteResource = (resourceId) => {
    return instance.delete(`/api/resource/${resourceId}`);
};


export const uploadResourceFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return instance.post("/api/resource/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const downloadResourceFile = (filename) => {
    return instance.get(`/api/resource/download/${filename}`, {
        responseType: "blob",
    });
};

export default {
    getAllResources,
    getResourceById,
    addResource,
    editResource,
    deleteResource,
    uploadResourceFile,
    downloadResourceFile,
    getResourcesForUser,
};