import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Dropdown, InputText, Modal } from '../../../../components';
import { useApiForm } from '@/hooks/use-api-form';
import { FormData } from '../../interfaces/form-info';
import { useNavigate } from 'react-router';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';
import { useOlympiads } from '../../hooks/use-olympiads';
import { useConfirmation } from '../../hooks/use-confirmation';
import {
  validateDateOverlap,
  validateDateInYear,
  validateFutureDate,
  validateEndDateAfterStart,
  createOlympiadPayload,
  formatApiError,
} from '../../utils/olympiad-helpers';
import {
  YEAR_OPTIONS,
  ERROR_MESSAGES,
  VALIDATION_PATTERNS,
  VALIDATION_LIMITS,
  ROUTES,
} from '../../constants/olympiad-constants';

export default function FormInfo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);

  const { olympiads, checkOlympiadNameExists } = useOlympiads();
  const {
    showModal,
    showConfirmationModal,
    confirmationStatus,
    confirmationMessage,
    openModal,
    closeModal,
    closeConfirmationModal,
    showSuccess,
    showError,
  } = useConfirmation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, dirtyFields },
    getValues,
    watch,
    trigger,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      year: '',
    },
  });

  const { submitForm } = useApiForm('olympiads');
  const [justReset, setJustReset] = useState(false);
  const selectedYear = watch('year');

  const onSubmit = async (data: FormData) => {
    setFormData(data);
    openModal();
  };
  const onConfirm = async () => {
    if (!formData) return;
    const payload = createOlympiadPayload({
      ...formData,
      cost: formData.cost.toString(),
      limitAreas: formData.limitAreas.toString(),
    });

    try {
      console.log(payload);
      const response = await submitForm(payload);

      if (response) {
        showSuccess(ERROR_MESSAGES.SUCCESS_REGISTRATION);
        localStorage.setItem('year', formData.year);
      }
    } catch (error) {
      const errorMessage = formatApiError(error);
      const apiError = error as {
        data?: { errors?: Record<string, string[]> };
      };
      if (apiError.data?.errors) {
        setError('year', { message: errorMessage });
      }
      showError(errorMessage);
    }
    closeModal();
  };

  const handleCloseConfirmationModal = () => {
    closeConfirmationModal(() => {
      window.location.reload();
    });
  };

  const validateDates = async (
    dateIni: string,
    dateEnd: string,
    year: string,
  ) => {
    const yearNumber = Number(year);

    const overlapResult = validateDateOverlap(
      dateIni,
      dateEnd,
      yearNumber,
      olympiads,
    );
    if (overlapResult !== true) {
      return overlapResult;
    }

    return true;
  };
  useEffect(() => {
    if (justReset) {
      setJustReset(false);
    }

    const dateIni = getValues('dateIni');
    const dateEnd = getValues('dateEnd');

    if (dateIni) {
      trigger('dateIni');
    }

    if (dateEnd) {
      trigger('dateEnd');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  useEffect(() => {
    const subscription = watch((_value, { name }) => {
      if (name === 'dateIni') {
        trigger('dateEnd');
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  useEffect(() => {
    if (selectedYear && dirtyFields.inputNameOlimpiada) {
      trigger('inputNameOlimpiada');
    }
  }, [selectedYear, trigger, dirtyFields.inputNameOlimpiada]);

  return (
    <div className="flex flex-col items-center mx-5 md:mx-5 lg:mx-0">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 mb-32">
        <div className="flex flex-col">
          <h1 className="text-center text-primary mb-6 headline-lg">
            Registro de Información General de la Olimpiada
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-9 mb-6">
            {' '}
            <Dropdown
              name="year"
              label="Año/Gestión"
              placeholder="Seleccionar año o gestión"
              className="w-full  lg:w-[480px]"
              options={YEAR_OPTIONS}
              displayKey="name"
              valueKey="id"
              register={register}
              errors={errors}
              validationRules={{
                required: ERROR_MESSAGES.REQUIRED_YEAR,
              }}
            />
            <InputText
              label="Nombre de la Olimpiada"
              name="inputNameOlimpiada"
              placeholder="Ingresar nombre de la Olimpiada"
              type="text"
              className="w-full lg:w-[480px]"
              register={register}
              errors={errors}
              validationRules={{
                required: ERROR_MESSAGES.REQUIRED_OLYMPIAD_NAME,
                pattern: {
                  value: VALIDATION_PATTERNS.OLYMPIAD_NAME,
                  message: ERROR_MESSAGES.INVALID_OLYMPIAD_NAME,
                },
                maxLength: {
                  value: VALIDATION_LIMITS.MAX_OLYMPIAD_NAME_LENGTH,
                  message: ERROR_MESSAGES.MAX_LENGTH_OLYMPIAD_NAME,
                },
                validate: (value: string) => {
                  const year = getValues('year');
                  if (!year) {
                    return ERROR_MESSAGES.SELECT_YEAR_FIRST;
                  }

                  const exists = checkOlympiadNameExists(value, Number(year));
                  if (exists) {
                    return ERROR_MESSAGES.OLYMPIAD_NAME_EXISTS;
                  }
                  return true;
                },
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-9 mb-6">
            <InputText
              label="Costo de Inscripción"
              name="cost"
              placeholder="0.00"
              type="text"
              className="w-full lg:w-[480px]"
              register={register}
              validationRules={{
                pattern: {
                  value: VALIDATION_PATTERNS.COST,
                  message: ERROR_MESSAGES.INVALID_COST,
                },
                required: ERROR_MESSAGES.REQUIRED_COST,
                min: {
                  value: VALIDATION_LIMITS.MIN_COST,
                  message: ERROR_MESSAGES.MIN_COST,
                },
              }}
              errors={errors}
            />

            <InputText
              label="Límite de Áreas por Estudiante"
              name="limitAreas"
              placeholder="0"
              type="text"
              className="w-full lg:w-[480px]"
              register={register}
              validationRules={{
                pattern: {
                  value: VALIDATION_PATTERNS.POSITIVE_INTEGER,
                  message: ERROR_MESSAGES.INVALID_LIMIT_AREAS,
                },
                required: ERROR_MESSAGES.REQUIRED_LIMIT_AREAS,
                min: {
                  value: VALIDATION_LIMITS.MIN_LIMIT_AREAS,
                  message: ERROR_MESSAGES.MIN_LIMIT_AREAS,
                },
                max: {
                  value: VALIDATION_LIMITS.MAX_LIMIT_AREAS,
                  message: ERROR_MESSAGES.MAX_LIMIT_AREAS,
                },
              }}
              errors={errors}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^0-9]/g, '');
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-9 mb-6">
            <InputText
              label="Fecha de Inicio"
              name="dateIni"
              placeholder="DD/MM/YYYY"
              type="date"
              className="w-full lg:w-[480px]"
              register={register}
              validationRules={{
                required: ERROR_MESSAGES.REQUIRED_START_DATE,
                validate: async (value: string) => {
                  const selectedYear = getValues('year');

                  if (!selectedYear) {
                    return ERROR_MESSAGES.SELECT_YEAR_FIRST;
                  }

                  const yearValidation = validateDateInYear(
                    value,
                    selectedYear,
                  );
                  if (yearValidation !== true) {
                    return yearValidation;
                  }

                  const futureValidation = validateFutureDate(value);
                  if (futureValidation !== true) {
                    return futureValidation;
                  }

                  return await validateDates(
                    value,
                    getValues('dateEnd') || value,
                    selectedYear,
                  );
                },
              }}
              errors={errors}
            />

            <InputText
              label="Fecha de Cierre"
              name="dateEnd"
              placeholder="DD/MM/YYYY"
              type="date"
              className="w-full lg:w-[480px]"
              register={register}
              validationRules={{
                required: ERROR_MESSAGES.REQUIRED_END_DATE,
                validate: async (value: string) => {
                  const selectedYear = getValues('year');
                  const dateIniValue = getValues('dateIni');

                  if (!dateIniValue) {
                    return ERROR_MESSAGES.SELECT_START_DATE_FIRST;
                  }

                  if (!selectedYear) {
                    return ERROR_MESSAGES.SELECT_YEAR_FIRST;
                  }

                  const yearValidation = validateDateInYear(
                    value,
                    selectedYear,
                  );
                  if (yearValidation !== true) {
                    return yearValidation;
                  }

                  const endAfterStartValidation = validateEndDateAfterStart(
                    dateIniValue,
                    value,
                  );
                  if (endAfterStartValidation !== true) {
                    return endAfterStartValidation;
                  }

                  return await validateDates(dateIniValue, value, selectedYear);
                },
              }}
              errors={errors}
            />
          </div>
          <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
            {' '}
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
        </div>
      </form>{' '}
      {showModal && (
        <Modal
          onClose={closeModal}
          text={ERROR_MESSAGES.CONFIRM_REGISTRATION}
          onConfirm={onConfirm}
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
}
