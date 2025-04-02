import { postData } from '@/services/api-service';
import { useState } from 'react';

export const useApiForm = (endpoint: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const submitForm = async (data: object) => {
    try {
      const response = await postData(endpoint, data);
      setSuccess(true);
      return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitForm,
    loading,
    error,
    success,
  };
};
