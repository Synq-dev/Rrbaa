const API = "https://propecia-foreign-pace-minutes.trycloudflare.com";

const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("rb_token") || "";
    }
    return "";
};

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<{ ok: true, data: T, meta?: any }> {
  const headers = new Headers(init.headers || {});
  
  if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (!headers.has("Authorization") && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let res;
  try {
    res = await fetch(`${API}${path}`, { ...init, headers });
  } catch (error) {
    console.error('Fetch failed:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Failed to fetch: Could not connect to the API server. Please check the network connection and the API endpoint. It might be a CORS or mixed content issue.');
    }
    throw error;
  }


  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("rb_token");
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    throw new Error("Unauthorized. Please log in again.");
  }
  
  let json;
  try {
    json = await res.json();
  } catch (e) {
    if (res.ok) {
        return { ok: true, data: {} as T };
    }
    throw new Error("Bad JSON response from server");
  }


  if (!json.ok) {
    throw new Error(json.error || `API Error: ${res.status}`);
  }

  return json;
}
