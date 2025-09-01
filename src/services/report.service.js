import base from "./base.service";

const instance = base.service();


export const getAllReports = () => {
    return instance.get("/api/report");
};


export const addReport = (newReport) => {
    return instance.post("/api/report", newReport);
};


export const editReport = (instructorId, studentId, updatedReport) => {
    return instance.put(`/api/report/edit/${instructorId},${studentId}`, updatedReport);
};


export const deleteReport = (instructorId, studentId) => {
    return instance.delete(`/api/report/${instructorId},${studentId}`);
};

export const getAllThreadReports = () => {
    return instance.get("/api/thread-report");
};



export const addThreadReport = (newReport) => {
    return instance.post("/api/thread-report", newReport);
};


export const editThreadReport = (instructorId, studentId, updatedReport) => {
    return instance.put(`/api/thread-report/edit/${instructorId},${studentId}`, updatedReport);
};


export const deleteThreadReport = (instructorId, studentId) => {
    return instance.delete(`/api/thread-report/${instructorId},${studentId}`);
};

export const getAllResourceReports = () => {
    return instance.get("/api/resource-report");
};



export const addResourceReport = (newReport) => {
    return instance.post("/api/resource-report", newReport);
};


export const editResourceReport = (instructorId, studentId, updatedReport) => {
    return instance.put(`/api/resource-report/edit/${instructorId},${studentId}`, updatedReport);
};


export const deleteResourceReport = (instructorId, studentId) => {
    return instance.delete(`/api/resource-report/${instructorId},${studentId}`);
};


export const getAllCommentReports = () => {
    return instance.get("/api/comment-report");
};



export const addCommentReport = (newReport) => {
    return instance.post("/api/comment-report", newReport);
};


export const editCommentReport = (instructorId, studentId, updatedReport) => {
    return instance.put(`/api/comment-report/edit/${instructorId},${studentId}`, updatedReport);
};


export const deleteCommentReport = (instructorId, studentId) => {
    return instance.delete(`/api/comment-report/${instructorId},${studentId}`);
};

export const getAllAdvertReports = () => {
    return instance.get("/api/advert-report");
};



export const addAdvertReport = (newReport) => {
    return instance.post("/api/advert-report", newReport);
};


export const editAdvertReport = (instructorId, studentId, updatedReport) => {
    return instance.put(`/api/advert-report/edit/${instructorId},${studentId}`, updatedReport);
};


export const deleteAdvertReport = (instructorId, studentId) => {
    return instance.delete(`/api/advert-report/${instructorId},${studentId}`);
};

export const getReportsForComment = async (id) => {
    const response = await instance.get(`/api/comment-report/comment/${id}`);
    return response.data;
};

export const getReportsForResource = async (id) => {
    const response = await instance.get(`/api/resource-report/resource/${id}`);
    return response.data;
};

export const getReportsForAdvert = async (id) => {
    const response = await instance.get(`/api/advert-report/advert/${id}`);
    return response.data;
};

export const getReportsForThread = async (id) => {
    const response = await instance.get(`/api/thread-report/thread/${id}`);
    return response.data;
};

export default {
    getAllReports,
    addReport,
    editReport,
    deleteReport,

    getAllThreadReports,
    addThreadReport,
    editThreadReport,
    deleteThreadReport,

    getAllCommentReports,
    addCommentReport,
    editCommentReport,
    deleteCommentReport,

    getAllResourceReports,
    addResourceReport,
    editResourceReport,
    deleteResourceReport,

    getAllAdvertReports,
    addAdvertReport,
    editAdvertReport,
    deleteAdvertReport,

    getReportsForThread,
    getReportsForComment,
    getReportsForAdvert,
    getReportsForResource
};