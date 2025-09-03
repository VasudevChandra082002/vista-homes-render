
import api from "../config/axiosConfig";

export const login = (email, password) => {
    try{
        const response = api.post("/api/admin/login", {email, password});
        return response;
    }catch(error){
        return error;
    }
};

