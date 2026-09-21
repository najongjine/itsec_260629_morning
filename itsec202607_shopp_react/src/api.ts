const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL environment variable is required.');
}

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}
