export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setAuth(data: { token: string; admin?: any }) {
  localStorage.setItem("token", data.token);
  if (data.admin) localStorage.setItem("admin", JSON.stringify(data.admin));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
}

export function getAdmin(): any | null {
  const raw = localStorage.getItem("admin");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}
