import api from "../config/axiosConfig";

export async function getTeams() {
    const res = await api.get("/api/team/getTeams");
    return res.data?.data ?? []; // array
}


export async function updateTeamById(id, payload) {
    const res = await api.put(`/api/team/updateTeam/${id}`, payload);
    return res.data?.data ?? null; // updated object
}

export async function createTeam(payload) {
    const res = await api.post("/api/team/createTeam", payload);
    return res.data?.data ?? null; // created object
}

export async function deleteTeamById(id) {
    const res = await api.delete(`/api/team/deleteTeam/${id}`);
    return res.data?.data ?? null; // deleted object
}