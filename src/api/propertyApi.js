import api from "../config/axiosConfig";

export const createProperty = (data) => {
    try {
        const response = api.post("/api/property/createProperty", data);
        return response;
    } catch (error) {
        return error;
    }
};

export const getAllProperties = () => {
    try {
        const response = api.get("/api/property/getProperties");
        return response;
    } catch (error) {
        return error;
    }
};  

export const getPropertyById = (id) => {
    try {
        const response = api.get(`/api/property/getProperty/${id}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const updateProperty = (id, data) => {
    try {
        const response = api.put(`/api/property/updateProperty/${id}`, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const deletePropertyById = (id) => {
    try {
        const response = api.delete(`/api/property/deleteProperty/${id}`);
        return response;
    } catch (error) {
        return error;
    }
};