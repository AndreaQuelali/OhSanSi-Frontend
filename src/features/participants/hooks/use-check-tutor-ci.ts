import { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { ERROR_MESSAGES } from '../constants/participant-constants';
import { UseFormSetError, UseFormClearErrors } from 'react-hook-form';
import { FormValues } from '../interfaces/register-participants';
import { ParticipantApiService } from '../services/participant-api';

export function useCheckTutorCI(
  citutor: string,
  ciOlimpista: string,
  setError: UseFormSetError<FormValues>,
  clearErrors: UseFormClearErrors<FormValues>
) {
  const [isTutorRegistered, setIsTutorRegistered] = useState(false);

  const debouncedCheckCiTutorRef = useRef(
    debounce(async (ciTutorValue: string, ciOlimpista: string) => {
      if (!ciTutorValue || ciTutorValue.length < 4) {
        return;
      }
      if (ciTutorValue.length > 8) {
        return;
      }
      if (ciTutorValue === ciOlimpista) {
        clearErrors('olimpista.citutor');
        return;
      }
      try {
        const response = await ParticipantApiService.getTutorByCI(ciTutorValue);
        if (response.data) {
          clearErrors('olimpista.citutor');
          setIsTutorRegistered(false);
        } else {
          setError('olimpista.citutor', {
            type: 'manual',
            message: ERROR_MESSAGES.TUTOR_CI_UNREGISTERED,
          });
          setIsTutorRegistered(true);
        }
      } catch {
        setError('olimpista.citutor', {
          type: 'manual',
          message: ERROR_MESSAGES.TUTOR_CI_UNREGISTERED,
        });
        setIsTutorRegistered(true);
      }
    }, 500)
  );

  useEffect(() => {
    if (!citutor || citutor.length < 4) {
      return;
    }
    if (citutor === ciOlimpista) {
      clearErrors('olimpista.citutor');
      return;
    }
    debouncedCheckCiTutorRef.current(citutor, ciOlimpista);
  }, [citutor, ciOlimpista, clearErrors]);

  return {
    isTutorRegistered,
    debouncedCheckCiTutorRef,
  };
}
