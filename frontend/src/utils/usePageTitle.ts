import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export function useTestPageTitle() {
  const params = useParams();
  const { id, type } = params as { id: string; type: string };

  useEffect(() => {
    const path = window.location.pathname;
    
    if (path.includes('/reading/')) {
      document.title = 'Unbebel Reading';
    } else if (path.includes('/listening/')) {
      document.title = 'Unbebel Listening';
    } else if (path.includes('/speaking/')) {
      document.title = 'Unbebel Speaking';
    } else if (path.includes('/writing/')) {
      document.title = 'Unbebel Writing';
    }
  }, [id, type]);
} 