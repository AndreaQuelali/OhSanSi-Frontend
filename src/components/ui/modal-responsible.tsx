import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { InputText } from './input';
import { Button } from '@/components';
import { useForm } from 'react-hook-form';
import debounce from 'lodash/debounce';

interface ResponsiblePersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (responsibleCi: string) => void;
}

export default function ResponsiblePersonModal({
  isOpen,
  onClose,
  onConfirm,
}: ResponsiblePersonModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidCI, setIsValidCI] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      responsibleCi: '',
    },
  });

  const responsibleCi = watch('responsibleCi');

  useEffect(() => {
    if (!responsibleCi || responsibleCi.length < 4) {
      setError(null);
      setIsValidCI(false);
    }
  }, [responsibleCi]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const inputElement = document.getElementById('responsibleCi');
      if (inputElement) {
        setTimeout(() => {
          inputElement.focus();
        }, 100);
      }
    }
  }, [isOpen]);

  const validateResponsibleCi = debounce(async (ciValue: string) => {
    if (!ciValue || ciValue.length < 4) {
      setError(null);
      setIsValidCI(false);
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/person/${ciValue}`);

      if (response.data && response.status === 200) {
        setError(null);
        setIsValidCI(true);
      } else {
        setError('Este CI de responsable no está registrado.');
        setIsValidCI(false);
      }
    } catch (err) {
      console.error('Error validando CI del responsable:', err);
      setError('Este CI de responsable no está registrado.');
      setIsValidCI(false);
    } finally {
      setIsValidating(false);
    }
  }, 500);

  useEffect(() => {
    if (responsibleCi && responsibleCi.length >= 4) {
      validateResponsibleCi(responsibleCi);
    }
  }, [responsibleCi]);

  const handleCheck = () => {
    if (responsibleCi && responsibleCi.length >= 4) {
      validateResponsibleCi.cancel();
      validateResponsibleCi(responsibleCi);
    }
  };

  const handleCancel = () => {
    reset();
    setError(null);
    setIsValidCI(false);
    onClose();
  };

  const handleAceptarClick = () => {
    const responsibleCiValue = watch('responsibleCi');
    if (isValidCI && responsibleCiValue) {
      onConfirm(responsibleCiValue);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-neutral2 opacity-40" />
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50"
      >
        <h2 className="text-primary text-xl font-semibold mb-4">
          Cédula de identidad del responsable de la inscripción
        </h2>
        <InputText
          label="CI del responsable"
          name="responsibleCi"
          placeholder="Ingresar CI del responsable"
          className="w-full"
          register={register}
          validationRules={{
            required: 'El CI del responsable es obligatorio',
            minLength: {
              value: 4,
              message: 'Debe tener al menos 4 dígitos',
            },
            maxLength: {
              value: 8,
              message: 'No puede tener más de 8 dígitos',
            },
            pattern: {
              value: /^[0-9]+$/,
              message: 'Solo se permiten números',
            },
            onBlur: handleCheck,
          }}
          errors={errors}
        />

        {error &&
          !errors.responsibleCi &&
          responsibleCi &&
          responsibleCi.length >= 4 && (
            <p className="text-error subtitle-sm mt-[-20px]">{error}</p>
          )}

        {isValidCI && responsibleCi && responsibleCi.length >= 4 && (
          <p
            className={`text-green-600 subtitle-sm ${errors ? '' : 'mt-[-20px]'}`}
          >
            CI verificado correctamente
          </p>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            label="Cancelar"
            variantColor="variant2"
            onClick={handleCancel}
            type="button"
          />
          <Button
            label="Aceptar"
            variantColor={
              isValidating || !isValidCI ? 'variantDesactivate' : 'variant1'
            }
            disabled={isValidating || !isValidCI || !responsibleCi}
            onClick={handleAceptarClick}
            type="button"
          />
        </div>
      </div>
    </div>
  );
}
