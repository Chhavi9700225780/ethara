const API_BASE_URL = import.meta.env.VITE_API_URL;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Projects
  getProjects: () => fetchWithAuth('/projects'),

  createProject: (data: { title: string; description: string }) =>
    fetchWithAuth('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteProject: (id: string) =>
    fetchWithAuth(`/projects/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: () => fetchWithAuth('/tasks'),

  createTask: (data: {
    title: string;
    description?: string;
    assignedTo: string;
    project: string;
    status?: string;
  }) =>
    fetchWithAuth('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTask: (
    id: string,
    data: Partial<{ status: string; title: string; description: string }>
  ) =>
    fetchWithAuth(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteTask: (id: string) =>
    fetchWithAuth(`/tasks/${id}`, { method: 'DELETE' }),

  // ✅ USERS (FIXED)
  getUsers: () => fetchWithAuth('/users'),

  createUser: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) =>
    fetchWithAuth('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteUser: (id: string) =>
    fetchWithAuth(`/users/${id}`, {
      method: 'DELETE',
    }),
};