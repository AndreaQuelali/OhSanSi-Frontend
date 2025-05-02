import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api-config';

export function useTutorValidation(ciTutor: string) {
  const [tutorError, setTutorError] = useState<string | null>(null);

  useEffect(() => {
    const verificarTutor = async () => {
      if (!ciTutor) {
        setTutorError(null);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/tutores/cedula/${ciTutor}`,
        );

        if (response.data.status === 200) {
          setTutorError(null);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setTutorError('El tutor con esta cédula no existe.');
        } else {
          console.error('Error al verificar el tutor:', err);
        }
      }
    };

    verificarTutor();
  }, [ciTutor]);

  return { tutorError };
}
