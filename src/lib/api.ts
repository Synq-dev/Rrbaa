const API = "http://193.23.221.170:5050";

const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("rb_token") || "";
    }
    return "";
};

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<{ ok: true, data: T, meta?: any }> {
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (!headers.has("Authorization") && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API}${path}`, { ...init, headers });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("rb_token");
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    throw new Error("Unauthorized. Please log in again.");
  }
  
  // Use try-catch for responses that might not have a body (e.g., 204 No Content)
  let json;
  try {
    json = await res.json();
  } catch (e) {
    if (res.ok) {
        // Assume success if response is ok but no json body
        return { ok: true, data: {} as T };
    }
    throw new Error("Bad JSON response from server");
  }


  if (!json.ok) {
    throw new Error(json.error || `API Error: ${res.status}`);
  }

  return json;
}
