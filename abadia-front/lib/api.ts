export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Aseguramos que siempre enviamos las cookies (para el HttpOnly JWT)
  const defaultOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    let errorMessage = 'Error en la petición';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignoramos el error si no es JSON
    }
    throw new Error(errorMessage);
  }

  // Si es un 204 No Content (como en el logout), retornamos null
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
