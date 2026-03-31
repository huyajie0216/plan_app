const API_URL = 'http://localhost:3001/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('supabase_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '请求失败');
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  },
  profile: {
    get: () => request('/profile'),
    update: (data: any) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },
  plans: {
    list: () => request('/plans'),
    create: (data: any) => request('/plans', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string | number, data: any) => request(`/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string | number) => request(`/plans/${id}`, { method: 'DELETE' }),
  },
  water: {
    listLogs: () => request('/water-logs'),
    addLog: (data: any) => request('/water-logs', { method: 'POST', body: JSON.stringify(data) }),
    deleteLog: (id: string | number) => request(`/water-logs/${id}`, { method: 'DELETE' }),
    listSlots: () => request('/water-slots'),
    updateSlot: (id: string | number, data: any) => request(`/water-slots/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  food: {
    listLogs: () => request('/food-logs'),
    addLog: (data: any) => request('/food-logs', { method: 'POST', body: JSON.stringify(data) }),
    deleteLog: (id: string | number) => request(`/food-logs/${id}`, { method: 'DELETE' }),
  },
  trackers: {
    list: () => request('/custom-trackers'),
    create: (data: any) => request('/custom-trackers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string | number, data: any) => request(`/custom-trackers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string | number) => request(`/custom-trackers/${id}`, { method: 'DELETE' }),
  },
  weight: {
    list: () => request('/weight-logs'),
    add: (data: any) => request('/weight-logs', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string | number) => request(`/weight-logs/${id}`, { method: 'DELETE' }),
  },
  goals: {
    get: () => request('/goals'),
    update: (data: any) => request('/goals', { method: 'PUT', body: JSON.stringify(data) }),
  }
};
