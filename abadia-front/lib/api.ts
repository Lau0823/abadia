import { mockFetchApi } from './mockApi';

const isServer = typeof window === 'undefined';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || (isServer ? 'http://127.0.0.1:3102' : '/api');

// En la rama front-admin-mock usamos datos harcodeados por defecto para no requerir backend ni PostgreSQL.
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_REAL_API !== 'true';

export interface FetchApiOptions extends RequestInit {
  isFormData?: boolean;
}

export async function fetchApi(endpoint: string, options: FetchApiOptions = {}) {
  if (USE_MOCK_API) {
    return mockFetchApi(endpoint, options);
  }

  const url = `${API_URL}${endpoint}`;
  const { isFormData, headers: customHeaders, ...fetchOptions } = options;

  const isForm = isFormData || (typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData);

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  // Only set application/json if it's not a FormData upload
  if (!isForm && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  }

  const defaultOptions: RequestInit = {
    cache: 'no-store', // Omit cache by default
    ...fetchOptions,
    credentials: 'include',
    headers,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    let errorMessage = 'Error en la petición';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore if not JSON
    }
    throw new Error(errorMessage);
  }

  // 204 No Content handling
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
