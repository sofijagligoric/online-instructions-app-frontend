import base from "./base.service";

const instance = base.service();


export const getAllReviews = () => {
    return instance.get("/api/review");
};


export const getReviewsForInstructor = (instructorId) => {
    return instance.get(`/api/review/${instructorId}`);
};


export const addReview = (newReview) => {
    return instance.post("/api/review", newReview);
};


export const editReview = (instructorId, studentId, updatedReview) => {
    return instance.put(`/api/review/edit/${instructorId},${studentId}`, updatedReview);
};


export const deleteReview = (instructorId, studentId) => {
    return instance.delete(`/api/review/${instructorId},${studentId}`);
};

export default {
    getAllReviews,
    getReviewsForInstructor,
    addReview,
    editReview,
    deleteReview
};