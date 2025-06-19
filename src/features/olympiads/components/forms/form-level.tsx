import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';
import { Button, InputText, Modal } from '@/components';
import { TableLevel } from '../tables/table-level';
import { useLevels } from '../../hooks/use-levels';
import {
  LEVEL_ERROR_MESSAGES,
  LEVEL_VALIDATION_PATTERNS,
  LEVEL_VALIDATION_LIMITS,
} from '../../constants/level-constants';
import type { FormData } from '../../interfaces/form-level';
import { ROUTES } from '../../constants/olympiad-constants';

export const FormLevel = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
    reset,
    getValues,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<
    'success' | 'error' | null
  >(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

  const {
    levelsRegistered,
    fetchTableLevels,
    checkDuplicateLevel,
    registerLevel,
    error,
    setError: setLevelsError,
    setLevelsRegistered,
  } = useLevels();

  useEffect(() => {
    fetchTableLevels();
  }, [fetchTableLevels]);

  const onSubmit = async () => {
    clearErrors('inputLevel');
    const inputLevel = getValues('inputLevel');
    const isDuplicate = await checkDuplicateLevel(inputLevel);
    if (isDuplicate) {
      setError('inputLevel', {
        type: 'manual',
        message: LEVEL_ERROR_MESSAGES.DUPLICATE,
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleRegister = async () => {
    setIsModalOpen(false);
    const nameLevel = getValues('inputLevel');
    const result = await registerLevel(nameLevel);
    if (result.success) {
      setConfirmationStatus('success');
      setConfirmationMessage(LEVEL_ERROR_MESSAGES.REGISTER_SUCCESS);
      setShowConfirmationModal(true);
      reset();
      fetchTableLevels();
    } else {
      setConfirmationStatus('error');
      setConfirmationMessage(LEVEL_ERROR_MESSAGES.REGISTER_ERROR);
      setShowConfirmationModal(true);
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setConfirmationStatus(null);
    setConfirmationMessage('');
  };

  return (
    <div className="flex flex-col items-center w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-5 mt-10 mb-32 md:w-9/12 lg:w-7/12"
      >
        <div className="flex flex-col">
          <h1 className="text-center headline-lg text-primary">
            Registro de Niveles/Categorías de Competencia
          </h1>

          <div className="grid grid-cols-1 mb-2 md:mt-5 lg:mt-0">
            <InputText
              label="Nombre del Nivel/Categoría"
              name="inputLevel"
              placeholder="Ingresar nombre del nivel o categoría"
              type="text"
              className="w-full"
              labelPadding="py-5"
              register={register}
              errors={errors}
              validationRules={{
                required: LEVEL_ERROR_MESSAGES.REQUIRED,
                pattern: {
                  value: LEVEL_VALIDATION_PATTERNS.NAME,
                  message: LEVEL_ERROR_MESSAGES.PATTERN,
                },
                maxLength: {
                  value: LEVEL_VALIDATION_LIMITS.MAX_LENGTH,
                  message: LEVEL_ERROR_MESSAGES.MAX_LENGTH,
                },
              }}
            />
          </div>

          <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
            <Button
              label="Cancelar"
              variantColor="variant2"
              className="mt-5 md:mt-0"
              onClick={() => navigate(ROUTES.ADMINISTRATOR)}
            />
            <Button
              type="submit"
              label="Registrar"
              disabled={!isValid}
              variantColor={!isValid ? 'variantDesactivate' : 'variant1'}
            />
          </div>
          <h2 className="text-primary subtitle-md mb-5 mt-7 md:mt-5">
            Niveles/Categorías registradas
          </h2>
          <div className="mt-2 md:w-11/12 mx-auto">
            <TableLevel data={levelsRegistered} />
          </div>
        </div>
      </form>

      {isModalOpen && (
        <Modal
          text="¿Está seguro de registrar este nivel o categoría?"
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleRegister}
        />
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          onClose={handleCloseConfirmationModal}
          status={confirmationStatus || 'error'}
          message={confirmationMessage}
        />
      )}
    </div>
  );
};
