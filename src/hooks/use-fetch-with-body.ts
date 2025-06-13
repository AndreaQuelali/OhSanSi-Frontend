import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchDataWithBody = <T>(
  endpoint: string | null,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
  },
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!endpoint) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios({
          url: endpoint,
          method: options?.method || 'GET',
          data: options?.body || null,
          headers: options?.headers || { 'Content-Type': 'application/json' },
        });
        setData(response.data);
      } catch (err) {
        setError(
          (err instanceof Error ? err.message : 'Error desconocido') ||
            'Error al obtener los datos.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(options)]);

  return { data, loading, error };
};
