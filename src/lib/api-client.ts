export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  token?: string;
  timeoutMs?: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '') {
    this.baseUrl = baseUrl;
  }

  public async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, token, timeoutMs = 15000 } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const reqHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: reqHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      let data: unknown = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      if (!res.ok) {
        const errorMsg = (typeof data === 'object' && data !== null && 'error' in data)
          ? String((data as { error: unknown }).error)
          : `HTTP Error ${res.status}: ${res.statusText}`;
        throw new Error(errorMsg);
      }

      return data as T;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeoutMs}ms`);
      }
      throw err;
    }
  }
}

export const apiClient = new ApiClient();
