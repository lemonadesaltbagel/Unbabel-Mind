export const checkTokenAndWarn = async () => {
  try {
    const response = await fetch('/profile/configs');
    
    if (response.ok) {
      const data = await response.json();
      if (!data.openaiToken || data.openaiToken.length === 0) {
        return false;
      }
    } else {
      return true;
    }
  } catch {
    return false;
  }
  
  return true;
};
