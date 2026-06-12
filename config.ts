export const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL;
  
  if (url) {
    // Clean and sanitize any accidental trailing fragment hash (#) or query strings (?)
    const hashIndex = url.indexOf('#');
    if (hashIndex !== -1) {
      url = url.substring(0, hashIndex);
    }
    const queryIndex = url.indexOf('?');
    if (queryIndex !== -1) {
      url = url.substring(0, queryIndex);
    }
  }

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
