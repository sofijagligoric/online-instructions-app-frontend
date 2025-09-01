import base from "./base.service";

const instance = base.service();


export const getAllViolationTypes = () => {
    return instance.get("/api/violation");
};


export const addViolationType = (newViolationType) => {
    return instance.post("/api/violation", newViolationType);
};


export const editViolationType = (violationTypeId, updatedViolationType) => {
    return instance.put(`/api/violation/edit/${violationTypeId}`, updatedViolationType);
};


export const deleteViolationType = (violationTypeId) => {
    return instance.delete(`/api/violation/${violationTypeId}`);
};

export const getById = (id) =>
{
    return instance.get(`/api/violation/${id}`);
}

export default {
    getAllViolationTypes,
    addViolationType,
    editViolationType,
    deleteViolationType,
    getById
};