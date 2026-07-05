/**
 * Types
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Constants
 */

const SUPABASE_AUTH_KEY_PREFIX = 'sb-';
const SUPABASE_AUTH_KEY_SUFFIX = '-auth-token';

/**
 * Helpers
 */

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new Error('VITE_API_URL is not defined in environment');
  }
  return url;
};

const findSupabaseSessionKey = (): string | null => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key?.startsWith(SUPABASE_AUTH_KEY_PREFIX) &&
      key?.endsWith(SUPABASE_AUTH_KEY_SUFFIX)
    ) {
      return key;
    }
  }
  return null;
};

const getToken = (): string | null => {
  try {
    const key = findSupabaseSessionKey();
    if (!key) {
      return null;
    }

    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    const session = JSON.parse(raw);
    return session?.access_token ?? null;
  } catch {
    return null;
  }
};

const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${getBaseUrl()}${endpoint}`;
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers,
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(
      `Request failed: ${response.statusText}`,
      response.status
    );
  }

  const data = (await response.json()) as T;

  return {
    data,
    status: response.status,
    ok: response.ok,
  };
};

/**
 * ApiClient
 */

export const apiClient = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: 'GET',
    }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: 'DELETE',
    }),
};
