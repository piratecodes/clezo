// Grab the base URL from your .env file
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

let refreshPromise = null;

export const fetchClient = async (endpoint, options = {}) => {
  // 1. Setup standard headers
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  // 2. Configure the fetch payload - CRITICAL: credentials: 'include' sends HttpOnly cookies
  const config = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    // 3. Fire the actual request to your Node.js backend
    let response = await fetch(`${BASE_URL}${endpoint}`, config);

    // 4. 🚨 SILENT REFRESH: If access token is expired
    if (response.status === 401) {
      // Don't loop infinitely on login or refresh endpoints
      if (endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
        if (!refreshPromise) {
          refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
          }).then(res => {
            if (!res.ok) throw new Error('Refresh failed');
            return res;
          }).finally(() => {
            refreshPromise = null;
          });
        }

        try {
          await refreshPromise;
          // Refresh succeeded! Retry the original request seamlessly
          response = await fetch(`${BASE_URL}${endpoint}`, config);
        } catch (e) {
          // Do not show the "session expired" toast on initial app load check
          if (endpoint !== '/auth/me') {
            window.dispatchEvent(new Event('session-expired'));
          }
          
          if (endpoint === '/auth/me') {
            throw new Error('Unauthorized');
          }
          // Return a promise that never resolves to prevent components from throwing "developer style" errors before they are unmounted
          return new Promise(() => {});
        }
      } else {
        // If we got 401 on login or refresh itself
        throw new Error('Unauthorized');
      }
    }

    // 5. Parse the JSON response
    // Sometimes response doesn't have JSON (e.g. rate limit plain text or 204), handle it safely
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const textData = await response.text();
      data = { message: textData || 'An error occurred with the server.' };
    }

    // 6. Catch backend AppError messages 
    if (!response.ok) {
      if (response.status === 404) {
        return { data: {} }; 
      }
      throw new Error(data.message || 'An error occurred with the server.');
    }

    return data; 

  } catch (error) {
    throw error;
  }
};