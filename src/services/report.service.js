import base from "./base.service";

const instance = base.service();


export const getAllReports = () => {
    return instance.get("/api/report");
};


export const addReport = (newReport) => {
    return instance.post("/api/report", newReport);
};


export const editReport = (reportId, updatedReport) => {
    return instance.put(`/api/report/edit/${reportId}`, updatedReport);
};


export const deleteReport = (reportId) => {
    return instance.delete(`/api/report/${reportId}`);
};

export const getAllThreadReports = () => {
    return instance.get("/api/thread-report");
};



export const addThreadReport = (newReport) => {
    return instance.post("/api/thread-report", newReport);
};


export const editThreadReport = (reportId, updatedReport) => {
    return instance.put(`/api/thread-report/edit/${reportId}`, updatedReport);
};


export const deleteThreadReport = (reportId) => {
    return instance.delete(`/api/thread-report/${reportId}`);
};

export const getAllResourceReports = () => {
    return instance.get("/api/resource-report");
};



export const addResourceReport = (newReport) => {
    return instance.post("/api/resource-report", newReport);
};


export const editResourceReport = (reportId, updatedReport) => {
    return instance.put(`/api/resource-report/edit/${reportId}`, updatedReport);
};


export const deleteResourceReport = (reportId) => {
    return instance.delete(`/api/resource-report/${reportId}`);
};


export const getAllCommentReports = () => {
    return instance.get("/api/comment-report");
};



export const addCommentReport = (newReport) => {
    return instance.post("/api/comment-report", newReport);
};


export const editCommentReport = (reportId, updatedReport) => {
    return instance.put(`/api/comment-report/edit/${reportId}`, updatedReport);
};


export const deleteCommentReport = (reportId) => {
    return instance.delete(`/api/comment-report/${reportId}`);
};

export const getAllAdvertReports = () => {
    return instance.get("/api/advert-report");
};



export const addAdvertReport = (newReport) => {
    return instance.post("/api/advert-report", newReport);
};


export const editAdvertReport = (reportId, updatedReport) => {
    return instance.put(`/api/advert-report/edit/${reportId}`, updatedReport);
};


export const deleteAdvertReport = (reportId) => {
    return instance.delete(`/api/advert-report/${reportId}`);
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
export const getAllThreadReportsWithDetails = async () => {
    const [reportsRes, threadReportsRes] = await Promise.all([
        getAllReports(),  
        getAllThreadReports() 
    ]);

    const reports = reportsRes.data; 
    const threadReports = threadReportsRes.data;

    return threadReports.map(tr => {
        const report = reports.find(r => r.id === tr.reportId);
        return {
            ...report,
            contentType: "thread",
            contentId: tr.threadId
        };
    });
};

export const getAllAdvertReportsWithDetails = async () => {
    const [reportsRes, advertReportsRes] = await Promise.all([
        getAllReports(),
        getAllAdvertReports()
    ]);

    const reports = reportsRes.data;
    const advertReports = advertReportsRes.data;

    return advertReports.map(ar => {
        const report = reports.find(r => r.id === ar.reportId);
        return {
            ...report,
            contentType: "advert",
            contentId: ar.advertId
        };
    });
};

export const getAllResourceReportsWithDetails = async () => {
    const [reportsRes, resourceReportsRes] = await Promise.all([
        getAllReports(),
        getAllResourceReports()
    ]);

    const reports = reportsRes.data;
    const resourceReports = resourceReportsRes.data;

    return resourceReports.map(rr => {
        const report = reports.find(r => r.id === rr.reportId);
        return {
            ...report,
            contentType: "resource",
            contentId: rr.resourceId
        };
    });
};

export const getAllCommentReportsWithDetails = async () => {
    const [reportsRes, commentReportsRes] = await Promise.all([
        getAllReports(),
        getAllCommentReports()
    ]);

    const reports = reportsRes.data;
    const commentReports = commentReportsRes.data;

    return commentReports.map(cr => {
        const report = reports.find(r => r.id === cr.reportId);
        return {
            ...report,
            contentType: "comment",
            contentId: cr.commentId
        };
    });
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
    getReportsForResource,

    getAllResourceReportsWithDetails,
    getAllThreadReportsWithDetails,
    getAllAdvertReportsWithDetails,
    getAllCommentReportsWithDetails
};