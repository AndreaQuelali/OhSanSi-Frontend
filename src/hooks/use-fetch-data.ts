import { useState, useEffect } from 'react';
import { getData } from '@/services/api-service';

export const useFetchData = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getData(endpoint);
        setData(response);
      } catch (err: any) {
        setError(err.message || 'Error al obtener los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};
