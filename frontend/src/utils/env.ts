import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export const loadOpenAIToken = () => {
  try {
    const path = join(process.cwd(), 'openai_token.txt');
    if (existsSync(path)) {
      return readFileSync(path, 'utf8').trim();
    }
  } catch (error) {
    console.error('Error loading OpenAI token:', error);
  }
  return null;
};

export const saveOpenAIToken = (token: string) => {
  try {
    const path = join(process.cwd(), 'openai_token.txt');
    writeFileSync(path, token, 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving OpenAI token:', error);
    return false;
  }
};

export const isTokenConfigured = () => {
  const token = loadOpenAIToken();
  return token && token.length > 0 && token !== 'your_openai_api_key_here';
};
