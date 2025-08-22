export const getBackendUrl=()=>typeof window!=='undefined'?'http://localhost:3001':(process.env.NEXT_PUBLIC_API_URL?.replace('/api','')||'http://localhost:3001');
