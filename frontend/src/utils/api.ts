import type { User, AuthResponse, Passage, AnswerSubmission, SubmissionResult, Progress } from '@/types';

const baseURL = typeof window !== 'undefined' 
  ? 'http://localhost:3001/api' 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');

console.log('API URL:', baseURL);
console.log('Environment variables:', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, 
  NODE_ENV: process.env.NODE_ENV
});

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!baseURL) {
      throw new Error('API base URL not configured');
    }
    
    const url = `${baseURL}${endpoint}`;
    console.log('Making request to:', url, 'Base URL:', baseURL, 'Endpoint:', endpoint);
    
    const authHeaders = getAuthHeaders();
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeaders as Record<string, string>),
        ...(options.headers as Record<string, string>)
      },
      ...options
    };
    
    console.log('Request config:', config);
    
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        console.log('Request failed:', response.status, error);
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      return response.json();
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      throw fetchError;
    }
  },
  
  get: <T>(endpoint: string) => apiClient.request<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) => apiClient.request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) => apiClient.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => apiClient.request<T>(endpoint, { method: 'DELETE' })
};

export const authAPI = {
  login: (email: string, password: string) => apiClient.post<AuthResponse>('/auth/login', { email, password }),
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => 
    apiClient.post<AuthResponse>('/auth/register', data),
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
  getProfile: () => apiClient.get<User>('/auth/profile'),
  updateProfile: (data: { firstName: string; lastName: string; email: string }) => 
    apiClient.put<User>('/auth/profile', data)
};

export const passageAPI = {
  getAll: () => apiClient.get<Passage[]>('/passages'),
  getById: (id: string) => apiClient.get<Passage>(`/passages/${id}`),
  submitAnswer: (id: string, answer: AnswerSubmission) => 
    apiClient.post<SubmissionResult>(`/passages/${id}/submit`, answer),
  getProgress: () => apiClient.get<Progress>('/passages/progress')
};