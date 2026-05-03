const BASE = import.meta.env.VITE_API_URL;

if (!BASE) {
  console.error('[api.js] VITE_API_URL tanımlı değil!');
}

// Token süresi dolmuşsa oturumu kapat ve giriş sayfasına yönlendir
const handleUnauthorized = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  window.location.href = '/giris-yap';
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Oturum süresi doldu.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Bir hata oluştu.');
  return data;
};

export const api = {
  get: (path) =>
    fetch(`${BASE}${path}`, { headers: getHeaders() }).then(handleResponse),

  post: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  patch: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path) =>
    fetch(`${BASE}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),
};
