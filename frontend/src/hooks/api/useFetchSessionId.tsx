import { useEffect, useState } from 'react';

const useFetchSessionId = () => {
  const [jsessionid, setJSessionId] = useState<string | null>(null);
  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const response = await fetch('/api/getSessionId');
        if (!response.ok) {
          throw new Error('Failed to fetch session ID');
        }
        const data = await response.json();
        setJSessionId(data.JSESSIONID);
      } catch (error) {
       
      } finally {
        
      }
    };

    fetchSessionId();
  }, []);

  return { jsessionid };
};

export default useFetchSessionId;