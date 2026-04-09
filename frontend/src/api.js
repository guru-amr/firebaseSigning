const API = import.meta.env.VITE_API_URL

export const authFetch = (path, options = {}) =>
  fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      ...options.headers,
    },
  })

export default API
