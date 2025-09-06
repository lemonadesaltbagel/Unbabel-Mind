export const checkTokenAndWarn = async () => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/profile/configs', { headers });

    if (!response.ok) return false;

    const data = await response.json();
    if (!data.openaiToken || data.openaiToken.length === 0) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
};
