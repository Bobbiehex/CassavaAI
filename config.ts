export const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  
  // If we are in the browser and the current page is not localhost,
  // we must avoid hitting a hardcoded localhost API URL.
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    if (!url || url.includes('localhost')) {
      return '/api';
    }
  }

  // If VITE_API_URL is set, ensure it ends with /api
  if (url) {
    // If it already ends with /api, use it as is
    if (url.endsWith('/api')) {
      return url;
    }
    // If it ends with a slash, append api
    if (url.endsWith('/')) {
      return `${url}api`;
    }
    // Otherwise append /api
    return `${url}/api`;
  }
  // Fallback for local development
  return '/api';
};
