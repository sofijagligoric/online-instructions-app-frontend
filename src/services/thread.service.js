import base from "./base.service";

const instance = base.service();


export const getAllDiscussionThreads = () => {
    return instance.get("/api/thread");
};


export const getDiscussionThreadsForUser = async (userId) => {
    const response = await instance.get(`/api/thread/user/${userId}`);
    return response.data;
};


export const addDiscussionThread = (newDiscussionThread) => {
    return instance.post("/api/thread", newDiscussionThread);
};


export const editDiscussionThread = (discussionThreadId, updatedDiscussionThread) => {
    return instance.put(`/api/thread/${discussionThreadId}`, updatedDiscussionThread);
};


export const deleteDiscussionThread = (discussionThreadId) => {
    return instance.delete(`/api/thread/${discussionThreadId}`);
};

export const getById = (id) =>
{
    return instance.get(`/api/thread/${id}`);
}

export default {
    getAllDiscussionThreads,
    getDiscussionThreadsForUser,
    addDiscussionThread,
    editDiscussionThread,
    deleteDiscussionThread,
    getById
};