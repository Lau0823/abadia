const isServer = typeof window === 'undefined';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || (isServer ? 'http://127.0.0.1:3102' : '/api');

export interface FetchApiOptions extends RequestInit {
  isFormData?: boolean;
}

export async function fetchApi(endpoint: string, options: FetchApiOptions = {}) {
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
    // nginx devuelve un 413 en HTML cuando el body supera client_max_body_size (30 MB).
    let errorMessage =
      response.status === 413
        ? 'El archivo supera el límite de 30 MB. Comprime el archivo y vuelve a intentarlo.'
        : 'Error en la petición';
    try {
      const errorData = await response.json();
      const message = errorData?.message;
      if (Array.isArray(message)) {
        errorMessage = message.join(' ');
      } else if (typeof message === 'string' && message) {
        errorMessage = message;
      }
    } catch {
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
