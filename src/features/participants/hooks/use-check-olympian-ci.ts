import { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { ERROR_MESSAGES } from '../constants/participant-constants';
import { FormValues } from '../interfaces/register-participants';
import {
  FieldErrors,
  UseFormSetError,
  UseFormClearErrors,
  UseFormSetValue,
} from 'react-hook-form';
import { ParticipantApiService } from '../services/participant-api';

export function useCheckOlympianCI(
  ci: string,
  setValue: UseFormSetValue<FormValues>,
  setError: UseFormSetError<FormValues>,
  clearErrors: UseFormClearErrors<FormValues>,
  errors: FieldErrors<FormValues>
) {
  const [isRegisteredOlimpista, setIsRegisteredOlimpista] = useState(false);
  const [ciOlimpistaFound, setCiOlimpistaFound] = useState<string | null>(null);

  const debouncedCheckCiRef = useRef(
    debounce(async (ciValue: string) => {
      if (!ciValue || ciValue.length < 4 || ciValue.length > 8) {
        setIsRegisteredOlimpista(false);
        setCiOlimpistaFound(null);
        if (errors?.olimpista?.ci?.type === 'manual') {
          clearErrors('olimpista.ci');
        }
        return;
      }
      try {
        const response = await ParticipantApiService.getOlimpistByCI(ciValue);
        if (response.data) {
          const data = response.data;
          setValue('olimpista.name', data.nombres || '');
          setValue('olimpista.lastname', data.apellidos || '');
          setValue('olimpista.birthday', data.fecha_nacimiento || '');
          setValue('olimpista.email', data.correo_electronico || '');
          setValue('olimpista.phone', data.celular || '');
          setValue('olimpista.citutor', data.ci_tutor_legal || '');
          setValue('olimpista.depa', data.id_departamento || '');
          setValue('olimpista.prov', data.id_provincia || '');
          setValue('olimpista.colegio', data.id_colegio || '');
          setValue('olimpista.grade', data.id_grado || '');
          clearErrors();
          setError('olimpista.ci', {
            type: 'manual',
            message: ERROR_MESSAGES.DUPLICATE_CI,
          });
          setIsRegisteredOlimpista(true);
          setCiOlimpistaFound(ciValue);
        } else {
          if (errors?.olimpista?.ci?.type === 'manual') {
            clearErrors('olimpista.ci');
          }
          setIsRegisteredOlimpista(false);
          setCiOlimpistaFound(null);
          setValue('olimpista.name', '');
          setValue('olimpista.lastname', '');
          setValue('olimpista.birthday', '');
          setValue('olimpista.email', '');
          setValue('olimpista.phone', '');
          setValue('olimpista.citutor', '');
          setValue('olimpista.depa', '');
          setValue('olimpista.prov', '');
          setValue('olimpista.colegio', '');
          setValue('olimpista.grade', '');
        }
      } catch (error) {
        console.error('Error al verificar el CI:', error);
        if (errors?.olimpista?.ci?.type === 'manual') {
          clearErrors('olimpista.ci');
        }
        setIsRegisteredOlimpista(false);
        setCiOlimpistaFound(null);
      }
    }, 500),
  );

  useEffect(() => {
    debouncedCheckCiRef.current(ci);
  }, [ci]);

  return {
    isRegisteredOlimpista,
    ciOlimpistaFound,
    debouncedCheckCiRef,
    setIsRegisteredOlimpista,
    setCiOlimpistaFound,
  };
}
