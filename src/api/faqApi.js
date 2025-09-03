import api from "../config/axiosConfig";

export const createFaq = (data) => {
    try {
        const response = api.post("/api/faq/createfaq", data);
        return response;
    } catch (error) {
        return error;
    }
}

export const getAllfaq = () => {
    try {
        const response = api.get("/api/faq/getfaqs");
        return response;
    } catch (error) {
        return error;
    }
}

export const getfaqById = (id) => {
    try {
        const response = api.get(`/api/faq/getfaq/${id}`);
        return response;
    } catch (error) {
        return error;
    }
}

export const updateFaq = (id, data) => {
    try {
        const response = api.put(`/api/faq/updatefaq/${id}`, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const deleteFaq = (id) => {
    try {
        const response = api.delete(`/api/faq/deletefaq/${id}`);
        return response;
    } catch (error) {
        return error;
    }
}