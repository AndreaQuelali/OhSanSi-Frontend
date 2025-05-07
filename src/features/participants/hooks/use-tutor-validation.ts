import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api-config';

export function useTutorValidation(ciTutor: string) {
  const [tutorError, setTutorError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedCi = ciTutor.trim();

    // Si está vacío o no es válido, limpiar y salir
    if (!trimmedCi || !/^[0-9]+$/.test(trimmedCi)) {
      setTutorError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      const verificarTutor = async () => {
        try {
          const response = await axios.get(`${API_URL}/tutores/cedula/${trimmedCi}`);
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
    }, 50); // Espera 500ms antes de hacer la solicitud

    return () => clearTimeout(timeoutId); // Limpia si ciTutor cambia antes de los 500ms
  }, [ciTutor]);

  return { tutorError };
}
