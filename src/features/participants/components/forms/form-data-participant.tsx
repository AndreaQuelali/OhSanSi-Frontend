import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useApiForm } from '@/hooks/use-api-form';
import { Button, Dropdown, InputText, Modal } from '@/components';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';

import {
  ERROR_MESSAGES,
  MESSAGES,
  ROUTES,
  VALIDATION_LIMITS,
  VALIDATION_PATTERNS,
} from '../../constants/participant-constants';

import {
  Departamento,
  FormValues,
  Grado,
} from '../../interfaces/register-participants';

import { useCheckOlympianCI, useCheckTutorCI, useLoadSchools } from '../../hooks';
import { saveFieldToLocalStorage, buildOlimpistaPayload } from '../../utils';
import { useConfirmationParticipant } from '../../hooks';

export default function FormDataPart() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({ mode: 'onChange' });

  const navigate = useNavigate();
  const { data: grados, loading: loading, } = useFetchData<Grado[]>('/grades');
  const { data: departamentos,   loading: loadingDepartamentos } = useFetchData<Departamento[]>('/departaments');
  const { submitForm } = useApiForm('/olympists');

  const ci = watch('olimpista.ci');
  const citutor = watch('olimpista.citutor');
  const selectedDepartment = watch('olimpista.depa');
  const selectedProv = watch('olimpista.prov');

  const [ciConfirmed, setCiConfirmed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const {
    showModal,
    showConfirmationModal,
    confirmationStatus,
    confirmationMessage,
    openModal,
    closeModal,
    showSuccess,
    showError,
    closeConfirmationModal,
  } = useConfirmationParticipant();

  const {
    isRegisteredOlimpista,
    ciOlimpistaFound,
    debouncedCheckCiRef,
    setIsRegisteredOlimpista,
    setCiOlimpistaFound,
  } = useCheckOlympianCI(ci, setValue, setError, clearErrors, errors);

  const { isTutorRegistered, debouncedCheckCiTutorRef } = useCheckTutorCI(citutor, ci, setError, clearErrors);

  const {
    provincias,
    colegios,
    loadingProvincias,
    loadingColegios,
  } = useLoadSchools(selectedDepartment, selectedProv);

  const checkCi = () => {
    if (ci && ci.length <= 8) {
      debouncedCheckCiRef.current(ci);
    }
  };

  const checkCiTutor = () => {
    if (citutor) {
      if (citutor === ci) {
        const currentError = errors?.olimpista?.citutor?.type;
        if (currentError === 'manual') {
          clearErrors('olimpista.citutor');
        }
        return;
      }
      if (citutor.length <= 8) {
        debouncedCheckCiTutorRef.current(citutor, ci);
      }
    }
  };

  useEffect(() => {
    if (ciOlimpistaFound && ci !== ciOlimpistaFound) {
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
  }, [ci, ciOlimpistaFound, clearErrors, setValue]);

  useEffect(() => {
    setCiConfirmed(
      !!ci && ci.length >= 4 && VALIDATION_PATTERNS.CI.test(ci)
    );
  }, [ci]);

  useEffect(() => {
    if (isRegisteredOlimpista) {
      setShowMessage(true);
    } else {
      const timeout = setTimeout(() => setShowMessage(false), 50);
      return () => clearTimeout(timeout);
    }
  }, [isRegisteredOlimpista]);

  const handleDepartamentoChange = (id_departamento: string) => {
    setValue('olimpista.depa', id_departamento, { shouldValidate: true });
    setValue('olimpista.prov', '');
    setValue('olimpista.colegio', '');
    saveFieldToLocalStorage('depa', parseInt(id_departamento));
    saveFieldToLocalStorage('prov', '');
    saveFieldToLocalStorage('colegio', '');
  };

  const handleGradoChange = (id_grado: string) => {
    setValue('olimpista.grade', id_grado, { shouldValidate: true });
    saveFieldToLocalStorage('grade', parseInt(id_grado));
  };

  const handleProvinciaChange = (id_provincia: string) => {
    setValue('olimpista.prov', id_provincia, { shouldValidate: true });
    setValue('olimpista.colegio', '');
    saveFieldToLocalStorage('prov', parseInt(id_provincia));
    saveFieldToLocalStorage('colegio', '');
  };

  const handleColegioChange = (id_colegio: string) => {
    setValue('olimpista.colegio', id_colegio, { shouldValidate: true });
    saveFieldToLocalStorage('colegio', parseInt(id_colegio));
  };

  const handleRegister = async (data: FormValues) => {
    const payload = buildOlimpistaPayload(data);

    try {
      await submitForm(payload);
      showSuccess(ERROR_MESSAGES.SUCCESS_REGISTRATION_OLYMPIAN);
    } catch (error: any) {
      console.error(ERROR_MESSAGES.ERROR_REGISTRATION_OLYMPIAN, error);
      showError(
        error.data?.message || ERROR_MESSAGES.ERROR_REGISTRATION_OLYMPIAN
      );
    } finally {
      closeModal();
    }
  };

  const handleCloseConfirmationModal = () => {
    closeConfirmationModal(() => window.location.reload());
  };

  const handleNextStep = () => {
    navigate(ROUTES.REGISTER_SELECTED_AREAS);
  };

  const onNextStep = () => {
    navigate(ROUTES.REGISTER_TUTOR);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col items-center ">
        <form
          onSubmit={handleSubmit(() => openModal())}
          className="mx-5 mt-5 mb-32 md:w-9/12 lg:w-9/12"
        >
          <h1 className="text-primary headline-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center">
            Registro de Datos de Olimpista
          </h1>
          <h2 className="text-primary headline-sm mb-2 ">Datos personales</h2>
          <h2 className="text-primary subtitle-sm mb-2 ">
            Primero ingrese el número de cédula de identidad del olimpista que
            desea registrar.
          </h2>
          <div className="grid grid-cols-1 lg:gap-9 lg:mb-6">
            <InputText
              label="Cédula de identidad"
              name="olimpista.ci"
              placeholder="Ingresar cédula de identidad"
              className="w-full "
              register={register}
              validationRules={{
                required: ERROR_MESSAGES.REQUIRED_CI,
                minLength: {
                  value: VALIDATION_LIMITS.CI_MIN_LENGTH,
                  message: ERROR_MESSAGES.CI_MIN_LENGTH,
                },
                maxLength: {
                  value: VALIDATION_LIMITS.CI_MAX_LENGTH,
                  message: ERROR_MESSAGES.CI_MAX_LENGTH,
                },
                pattern: {
                  value: VALIDATION_PATTERNS.CI,
                  message: ERROR_MESSAGES.INVALID_CI,
                },
                onchange: checkCi,
              }}
              errors={errors}
            />
          </div>
          <div
            className={`
              transition-all duration-1000 ease-in-out transform overflow-hidden
              ${
                ciConfirmed
                  ? 'opacity-100 translate-y-0 max-h-full pointer-events-auto'
                  : 'opacity-0 -translate-y-10 max-h-0 pointer-events-none'
              }
            `}
          >
            <div
              className={`
              overflow-hidden transition-all duration-500 ease-in-out
              ${showMessage ? 'opacity-100 max-h-40 mb-4 md:mb-0' : 'opacity-0 max-h-0'}
            `}
            >
              <div className="bg-surface border-l-4 subtitle-sm border-primary text-onBack p-4 mb-6 rounded">
                <p>
                  {MESSAGES.FORM_OLYMPIAN_CI_REGISTERED}
                </p>
                <div className="mt-3 flex justify-end">
                  <Button
                    label="Ir a registro de olimpista en áreas de competencia"
                    onClick={() => navigate(ROUTES.REGISTER_SELECTED_AREAS)}
                    variantColor="variant4"
                  />
                </div>
              </div>
            </div>
            <h2 className="text-primary subtitle-sm mb-2 ">
              Antes de completar el formulario, asegúrate de haber registrado a
              un tutor. Si eres tu propio tutor, puedes ingresar tu propio
              número de cédula de identidad.
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 lg:mb-6">
              <InputText
                label="Nombre(s)"
                name="olimpista.name"
                placeholder="Ingresar nombres"
                className="w-full"
                register={register}
                validationRules={{
                  required: ERROR_MESSAGES.REQUIRED_NAME,
                  pattern: {
                    value: VALIDATION_PATTERNS.NAME,
                    message: ERROR_MESSAGES.INVALID_NAME,
                  },
                }}
                errors={errors}
                disabled={isRegisteredOlimpista}
              />
              <InputText
                label="Apellido(s)"
                name="olimpista.lastname"
                placeholder="Ingresar apellidos"
                className="w-full"
                register={register}
                validationRules={{
                  required: ERROR_MESSAGES.REQUIRED_LASTNAME,
                  pattern: {
                    value: VALIDATION_PATTERNS.LASTNAME,
                    message: ERROR_MESSAGES.INVALID_LASTNAME,
                  },
                }}
                errors={errors}
                disabled={isRegisteredOlimpista}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-9 lg:mb-6">
              <InputText
                label="Fecha de nacimiento"
                name="olimpista.birthday"
                placeholder="DD/MM/AAAA"
                type="date"
                className="w-full "
                register={register}
                validationRules={{
                  required: ERROR_MESSAGES.REQUIRED_BIRTHDATE,
                  validate: (value: string) => {
                    if (!value) return ERROR_MESSAGES.REQUIRED_BIRTHDATE;
                    const today = new Date();
                    const birthDate = new Date(value);
                    const age = today.getFullYear() - birthDate.getFullYear();
                    const hasBirthdayPassed =
                      today.getMonth() > birthDate.getMonth() ||
                      (today.getMonth() === birthDate.getMonth() &&
                        today.getDate() >= birthDate.getDate());
                    const exactAge = hasBirthdayPassed ? age : age - 1;
                    return (
                      (exactAge >= 6 && exactAge <= 18) ||
                      ERROR_MESSAGES.INVALID_BIRTHDATE
                    );
                  },
                }}
                errors={errors}
                disabled={isRegisteredOlimpista}
              />
              <InputText
                label="Correo electrónico"
                name="olimpista.email"
                placeholder="Ingresar correo electrónico"
                type="email"
                className="w-full "
                register={register}
                validationRules={{
                  required: ERROR_MESSAGES.REQUIRED_EMAIL,
                  pattern: {
                    value: VALIDATION_PATTERNS.EMAIL,
                    message: ERROR_MESSAGES.INVALID_EMAIL,
                  },
                }}
                errors={errors}
                disabled={isRegisteredOlimpista}
              />
              <div className="flex flex-col">
                <InputText
                  label="Cédula de identidad del tutor legal"
                  name="olimpista.citutor"
                  placeholder="Ingresar ci del tutor legal"
                  className="w-full "
                  register={register}
                  validationRules={{
                    required: ERROR_MESSAGES.REQUIRED_CI,
                    minLength: {
                      value: VALIDATION_LIMITS.CI_MIN_LENGTH,
                      message: ERROR_MESSAGES.CI_MIN_LENGTH,
                    },
                    maxLength: {
                      value: VALIDATION_LIMITS.CI_MAX_LENGTH,
                      message: ERROR_MESSAGES.CI_MAX_LENGTH,
                    },
                    pattern: {
                      value: VALIDATION_PATTERNS.CI,
                      message: ERROR_MESSAGES.INVALID_CI,
                    },
                    validate: (value: string) => {
                      return value === ci ? true : undefined;
                    },
                    onBlur: checkCiTutor,
                  }}
                  errors={errors}
                  disabled={isRegisteredOlimpista}
                />
                <div>
                  {isTutorRegistered && ci && citutor && ci != citutor && (
                    <div className="flex justify-end -my-2">
                      <Button
                        label="Ir a registro de tutor"
                        onClick={onNextStep}
                        variantColor="variant4"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-9 md:mb-6">
              {ci && citutor && ci === citutor && (
                <InputText
                  label="Número de celular"
                  name="olimpista.phone"
                  placeholder="Ingresar número de celular"
                  className="w-full"
                  register={register}
                  validationRules={{
                    required: ERROR_MESSAGES.REQUIRED_PHONE,
                    pattern: {
                      value: VALIDATION_PATTERNS.PHONE,
                      message: ERROR_MESSAGES.INVALID_PHONE,
                    },
                    maxLength: {
                      value: VALIDATION_LIMITS.PHONE_MAX_LENGTH,
                      message: ERROR_MESSAGES.PHONE_MAX_LENGTH,
                    },
                  }}
                  errors={errors}
                  disabled={isRegisteredOlimpista}
                />
              )}
            </div>
            <h2 className="text-primary headline-sm mb-2">Datos académicos</h2>
            <div className="grid md:grid-cols-2 md:gap-9 md:mb-6">
              <Dropdown
                label="Departamento"
                placeholder="Seleccionar departamento"
                className="w-ful"
                value={watch('olimpista.depa') ?? ''}
                options={
                  departamentos
                    ? departamentos.map((departamento) => ({
                        id: departamento.id_departamento.toString(),
                        name: departamento.nombre_departamento,
                      }))
                    : []
                }
                displayKey="name"
                valueKey="id"
                register={register}
                {...register('olimpista.depa', {
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleDepartamentoChange(e.target.value),
                })}
                disabled={loadingDepartamentos || isRegisteredOlimpista}
                errors={errors}
                validationRules={{
                  required: ERROR_MESSAGES.DEPARTMENT_REQUIRED,
                }}
              />
              <div>
                <Dropdown
                  label="Provincia"
                  placeholder="Seleccionar provincia"
                  className="w-full"
                  value={watch('olimpista.prov') ?? ''}
                  options={
                    provincias
                      ? provincias.map((provincia) => ({
                          id: provincia.id_provincia.toString(),
                          name: provincia.nombre_provincia,
                        }))
                      : []
                  }
                  displayKey="name"
                  valueKey="id"
                  register={register}
                  {...register('olimpista.prov', {
                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleProvinciaChange(e.target.value),
                  })}
                  disabled={loadingProvincias || isRegisteredOlimpista}
                  errors={errors}
                  validationRules={{
                    required: ERROR_MESSAGES.PROVINCE_REQUIRED,
                  }}
                />
                <div>
                  {!selectedDepartment && (
                    <span className="text-neutral subtitle-sm">
                      Primero seleccione un departamento.
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid  md:grid-cols-2 md:gap-9 mb-6">
              <div>
                <Dropdown
                  label="Unidad educativa"
                  placeholder="Seleccionar unidad educativa"
                  className="w-full"
                  value={watch('olimpista.colegio') ?? ''}
                  options={
                    colegios
                      ? colegios.map((colegio) => ({
                          id: colegio.id_colegio.toString(),
                          name: colegio.nombre_colegio,
                        }))
                      : []
                  }
                  displayKey="name"
                  valueKey="id"
                  register={register}
                  {...register('olimpista.colegio', {
                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleColegioChange(e.target.value),
                  })}
                  disabled={loadingColegios || isRegisteredOlimpista}
                  errors={errors}
                  validationRules={{
                    required: ERROR_MESSAGES.SCHOOL_REQUIRED,
                  }}
                />
                <div>
                  {!selectedProv && (
                    <span className="text-neutral subtitle-sm">
                      Primero seleccione una provincia.
                    </span>
                  )}
                </div>
              </div>
              <Dropdown
                label="Grado"
                placeholder="Seleccionar grado"
                className="w-full"
                value={watch('olimpista.grade') ?? ''}
                options={
                  grados
                    ? grados.map((grado) => ({
                        id: grado.id_grado.toString(),
                        name: grado.nombre_grado,
                      }))
                    : []
                }
                register={register}
                displayKey="name"
                valueKey="id"
                {...register('olimpista.grade', {
                  required: ERROR_MESSAGES.GRADE_REQUIRED,
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleGradoChange(e.target.value),
                })}
                disabled={loading || isRegisteredOlimpista}
                errors={errors}
              />
            </div>
            <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
              {!isRegisteredOlimpista ? (
                <>
                  <Button
                    label="Cancelar"
                    variantColor="variant2"
                    className="mt-5 md:mt-0"
                    onClick={() => navigate(ROUTES.OLYMPIAN_MENU)}
                  />
                  <Button
                    type="submit"
                    label="Registrar"
                    disabled={!isValid || Object.keys(errors).length > 0}
                    variantColor={
                      !isValid || Object.keys(errors).length > 0
                        ? 'variantDesactivate'
                        : 'variant1'
                    }
                  />
                </>
              ) : (
                <div className="flex justify-end mt-5">
                  <Button
                    label="Cancelar"
                    variantColor="variant2"
                    onClick={() => navigate(ROUTES.OLYMPIAN_MENU)}
                  />
                </div>
              )}
            </div>
          </div>
        </form>
        {showModal && (
          <Modal
            onClose={closeModal}
            text={ERROR_MESSAGES.CONFIRMATION_TEXT_OLYMPIAN}
            onConfirm={handleSubmit(handleRegister)}
          />
        )}
        {showConfirmationModal && (
          <ConfirmationModal
            onClose={handleCloseConfirmationModal}
            status={confirmationStatus || 'error'}
            message={confirmationMessage}
            nextStepText={
              confirmationStatus === 'success'
                ? ERROR_MESSAGES.NEXT_STEP_TEXT_OLYMPIAN
                : undefined
            }
            onNextStep={
              confirmationStatus === 'success' ? handleNextStep : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
