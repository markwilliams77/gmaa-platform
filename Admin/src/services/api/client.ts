const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ApiResult<T> = { data: T };

class ApiClientError extends Error {
  response?: { status: number; data: any };

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiClientError';
    this.response = { status, data };
  }
}

const request = async <T>(method: ApiMethod, path: string, body?: unknown): Promise<ApiResult<T>> => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  const contentType = response.headers.get('content-type') || '';
  let data: any = null;

  if (text && contentType.includes('application/json')) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: `Invalid JSON response from ${path}`, raw: text };
    }
  } else if (text) {
    data = { message: `${response.status} ${response.statusText} from ${path}`, raw: text };
  }

  if (!response.ok) {
    if (response.status === 401) {
      //localStorage.removeItem('auth_token');
      //localStorage.removeItem('admin_user');
    }
    throw new ApiClientError(data?.message || data?.error || response.statusText, response.status, data);
  }

  return { data };
};

export const api = {
  get: <T = any>(path: string) => request<T>('GET', path),
  post: <T = any>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T = any>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T = any>(path: string, body?: unknown) => request<T>('PATCH' as any, path, body),
  delete: <T = any>(path: string) => request<T>('DELETE', path),
};

export default api;
