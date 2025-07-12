import type { User, AuthResponse, Passage, AnswerSubmission, SubmissionResult, Progress } from '@/types';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};
export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const authHeaders = getAuthHeaders();
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeaders as Record<string, string>),
        ...(options.headers as Record<string, string>),
      },
      ...options,
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
  },
  get: <T>(endpoint: string) => apiClient.request<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) => apiClient.request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) => apiClient.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => apiClient.request<T>(endpoint, { method: 'DELETE' }),
};
export const authAPI = {
  login: (email: string, password: string) => apiClient.post<AuthResponse>('/auth/login', { email, password }),
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => apiClient.post<AuthResponse>('/auth/register', data),
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
  },
  getProfile: () => apiClient.get<User>('/auth/profile'),
};
export const passageAPI = {
  getAll: () => apiClient.get<Passage[]>('/passages'),
  getById: (id: string) => apiClient.get<Passage>(`/passages/${id}`),
  submitAnswer: (passageId: string, answer: AnswerSubmission) => apiClient.post<SubmissionResult>(`/passages/${passageId}/submit`, answer),
  getProgress: () => apiClient.get<Progress>('/passages/progress'),
};