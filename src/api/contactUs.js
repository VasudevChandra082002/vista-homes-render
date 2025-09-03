import api from "../config/axiosConfig";

export const getAllContactUs = () => {
    try {
        const response = api.get("/api/contact/getContacts");
        return response;
    } catch (error) {
        return error;
    }
};

export const deleteContactUs = (id) => {
    try {
        const response = api.delete(`/api/contact/deleteContact/${id}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const createContactUs = (data) => {
    try {
        const response = api.post("/api/contact/createContact", data);
        return response;
    } catch (error) {
        return error;
    }
};

export const getcontactUsById = (id) => {
    try {
        const response = api.get(`/api/contact/getContact/${id}`);
        return response;
    } catch (error) {
        return error;
    }
};