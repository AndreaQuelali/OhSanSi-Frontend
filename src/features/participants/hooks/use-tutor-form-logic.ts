// hooks/useTutorFormLogic.ts
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getData } from '@/services/api-service';
import { ERROR_MESSAGES, VALIDATION_PATTERNS } from '../constants/participant-constants';
import { FormData } from '../interfaces/form-tutor';

export const useTutorFormLogic = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: 'onChange', defaultValues: {} });

  const ciValue = watch('ci');
  const [isRegisteredTutor, setIsRegisteredTutor] = useState(false);
  const [ciTutorFound, setCiTutorFound] = useState<string | null>(null);
  const [ciConfirmed, setCiConfirmed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (ciValue && String(ciValue).length >= 4 && VALIDATION_PATTERNS.CI.test(ciValue)) {
      setCiConfirmed(true);
    } else {
      setCiConfirmed(false);
    }
  }, [ciValue]);

  useEffect(() => {
    const verificarCI = async () => {
      if (!ciValue || String(ciValue).length < 4) {
        setIsRegisteredTutor(false);
        setCiTutorFound(null);
        if (errors.ci?.type === 'ci-duplicado') {
          clearErrors('ci');
        }
        return;
      }
      try {
        const response = await getData(`/tutors/${ciValue}`);
        if (response && response.tutor) {
          setValue('name', response.tutor.nombres || '');
          setValue('lastname', response.tutor.apellidos || '');
          setValue('email', response.tutor.correo_electronico || '');
          setValue('phone', response.tutor.celular || '');

          if (!errors.ci || errors.ci?.type === 'ci-duplicado') {
            setError('ci', {
              type: 'ci-duplicado',
              message: ERROR_MESSAGES.DUPLICATE_CI,
            });
          }
          clearErrors();
          setIsRegisteredTutor(true);
          setCiTutorFound(ciValue);
        } else {
          if (errors.ci?.type === 'ci-duplicado') {
            clearErrors('ci');
          }
          setIsRegisteredTutor(false);
          setCiTutorFound(null);

          setValue('name', '');
          setValue('lastname', '');
          setValue('email', '');
          setValue('phone', '');
        }
      } catch (error: any) {
        if (errors.ci?.type === 'ci-duplicado') {
          clearErrors('ci');
        }
        setIsRegisteredTutor(false);
        setCiTutorFound(null);
      }
    };

    verificarCI();
  }, [ciValue, setError, clearErrors, setValue]);

  useEffect(() => {
    if (ciTutorFound && ciValue !== ciTutorFound) {
      if (errors.ci?.type === 'ci-duplicado') {
        clearErrors('ci');
      }
      setIsRegisteredTutor(false);
      setCiTutorFound(null);
      setValue('name', '');
      setValue('lastname', '');
      setValue('email', '');
      setValue('phone', '');
    }
  }, [ciValue, ciTutorFound, clearErrors, setValue]);

  useEffect(() => {
    if (isRegisteredTutor) {
      setShowMessage(true);
    } else {
      const timeout = setTimeout(() => setShowMessage(false), 50);
      return () => clearTimeout(timeout);
    }
  }, [isRegisteredTutor]);

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    ciValue,
    isRegisteredTutor,
    ciConfirmed,
    showMessage,
    setError,
    clearErrors,
    setValue,
  };
};
