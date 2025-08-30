import base from "./base.service";

const instance = base.service();


export const getAllComments = () => {
    return instance.get("/api/comment");
};


export const getCommentsByThread = async (threadId) => {
    const response = await instance.get(`/api/comment/thread/${threadId}`);
    return response.data;
};


export const addComment = (newComment) => {
    return instance.post("/api/comment", newComment);
};


export const editComment = (commentId, updatedComment) => {
    return instance.put(`/api/comment/edit/${commentId}`, updatedComment);
};


export const deleteComment = (commentId) => {
    return instance.delete(`/api/comment/${commentId}`);
};

export const getById = (id) =>
{
    return instance.get(`/api/comment/${id}`);
}

export default {
    getAllComments,
    getCommentsByThread,
    addComment,
    editComment,
    deleteComment,
    getById
};