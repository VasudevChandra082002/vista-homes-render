import api from "../config/axiosConfig";


// Get array of static docs
export async function getStaticList() {
  const res = await api.get("/api/static/getAllStatics");
  return res.data?.data ?? []; // array
}


export async function getStaticById(id) {
  const res = await api.get(`/api/static/getStatic/${id}`);
  return res.data?.data ?? null; // object
}

// Update one by id
export async function updateStaticById(id, payload) {
  const res = await api.put(`/api/static/updateStatic/${id}`, payload);
  return res.data?.data ?? null; // updated object
}
