// API Configuration
export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL;
};

export const apiUrl = (path: string) => {
  const baseUrl = getApiBaseUrl() || 'http://localhost:3000';
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
};