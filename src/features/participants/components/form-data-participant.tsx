import { useFetchData } from '@/hooks/use-fetch-data';
import { Button, Dropdown, InputText, Modal } from '../../../components';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { API_URL } from '@/config/api-config';
import {
  Departamento,
  FormValues,
  Grado,
  Provincia,
  UnidadEducativa,
} from '../interfaces/register-participants';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useApiForm } from '@/hooks/use-api-form';
import { debounce } from 'lodash';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';

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
  const [showModal, setShowModal] = useState(false);
  const { data: grados, loading } = useFetchData<Grado[]>('/grades');
  const { submitForm } = useApiForm('/olympists');

  const { data: departamentos, loading: loadingDepartamentos } =
    useFetchData<Departamento[]>('/departments');

  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(false);

  const [colegios, setColegios] = useState<UnidadEducativa[]>([]);
  const [loadingColegios, setLoadingColegios] = useState(false);

  const selectedDepartment = watch('olimpista.depa');
  const selectedProv = watch('olimpista.prov');

  const ci = watch('olimpista.ci');
  const citutor = watch('olimpista.citutor');

  const ciValue = watch('olimpista.ci') || '';
  const [isRegisteredOlimpista, setIsRegisteredOlimpista] = useState(false);
  const [ciOlimpistaFound, setCiOlimpistaFound] = useState<string | null>(null);
  const [ciConfirmed, setCiConfirmed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<
    'success' | 'error' | null
  >(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [isTutorRegistered, setIsTutorRegistered] = useState(false);

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
        const response = await axios.get(`${API_URL}/olympists/${ciValue}`);
        if (response.data) {
          const data = response.data;

          // Autocompletar datos
          setValue('olimpista.name', data.names || '');
          setValue('olimpista.lastname', data.surnames || '');
          setValue('olimpista.birthday', data.birthdate || '');
          setValue('olimpista.email', data.email || '');
          setValue('olimpista.phone', data.phone || '');
          setValue('olimpista.citutor', data.guardian_legal_ci || '');
          setValue('olimpista.depa', data.department_id || '');
          setValue('olimpista.prov', data.province_id || '');
          setValue('olimpista.colegio', data.school_id || '');
          setValue('olimpista.grade', data.grade_id || '');
          setError('olimpista.ci', {
            type: 'manual',
            message: 'Este número de cédula ya está registrado.',
          });
          clearErrors();
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
    debouncedCheckCiRef.current(ciValue);
  }, [ciValue]);

  useEffect(() => {
    if (ciOlimpistaFound && ciValue !== ciOlimpistaFound) {
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
  }, [ciValue, ciOlimpistaFound, clearErrors, setValue]);

  useEffect(() => {
    if (ciValue && String(ciValue).length >= 4 && /^[0-9]+$/.test(ciValue)) {
      setCiConfirmed(true);
    } else {
      setCiConfirmed(false);
    }
  }, [ciValue]);

  useEffect(() => {
    if (isRegisteredOlimpista) {
      setShowMessage(true);
    } else {
      const timeout = setTimeout(() => setShowMessage(false), 50);
      return () => clearTimeout(timeout);
    }
  }, [isRegisteredOlimpista]);

  const debouncedCheckCiTutorRef = useRef(
    debounce(async (ciTutorValue: string, ciOlimpistaValue: string) => {
      if (!ciTutorValue || ciTutorValue.length < 4) {
        return;
      }

      if (ciTutorValue.length > 8) {
        return;
      }

      if (ciTutorValue === ciOlimpistaValue) {
        clearErrors('olimpista.citutor');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/tutors/${ciTutorValue}`);
        if (response.data) {
          clearErrors('olimpista.citutor');
          setIsTutorRegistered(false);
        } else {
          setError('olimpista.citutor', {
            type: 'manual',
            message: 'Este CI de tutor no está registrado.',
          });
          setIsTutorRegistered(true);
        }
      } catch {
        setError('olimpista.citutor', {
          type: 'manual',
          message: 'Este CI de tutor no está registrado.',
        });
        setIsTutorRegistered(true);
      }
    }, 500),
  );

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
    if (ci && ci.length >= 4) {
      debouncedCheckCiRef.current(ci);
    }
  }, [ci]);

  useEffect(() => {
    if (!citutor || citutor.length < 4) {
      return;
    }

    if (citutor === ci) {
      clearErrors('olimpista.citutor');
      return;
    }

    debouncedCheckCiTutorRef.current(citutor, ci);
  }, [citutor, ci, clearErrors]);

  useEffect(() => {
    if (selectedDepartment) {
      const fetchProvincias = async () => {
        setLoadingProvincias(true);
        try {
          const response = await axios.get(
            `${API_URL}/provinces/${selectedDepartment}`,
          );
          setProvincias(response.data);
        } catch (error) {
          console.error('Error al cargar las provincias:', error);
          setProvincias([]);
        } finally {
          setLoadingProvincias(false);
        }
      };

      fetchProvincias();
    } else {
      setProvincias([]);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedProv) {
      const fetchColegios = async () => {
        setLoadingColegios(true);
        try {
          const response = await axios.get(
            `${API_URL}/schools/provinces/${selectedProv}`,
          );
          setColegios(response.data);
        } catch (error) {
          console.error('Error al cargar las unidades educativas:', error);
          setColegios([]);
        } finally {
          setLoadingColegios(false);
        }
      };

      fetchColegios();
    } else {
      setColegios([]);
    }
  }, [selectedProv]);

  const handleDepartamentoChange = (department_id: string) => {
    setValue('olimpista.depa', department_id, { shouldValidate: true });
    setValue('olimpista.prov', '');
    setValue('olimpista.colegio', '');
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.depa = parseInt(department_id, 10);
    formData.olimpista.prov = '';
    formData.olimpista.colegio = '';
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

  const handleGradoChange = (grade_id: string) => {
    setValue('olimpista.grade', grade_id, { shouldValidate: true });
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.grade = parseInt(grade_id, 10);
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

  const handleProvinciaChange = (province_id: string) => {
    setValue('olimpista.prov', province_id, { shouldValidate: true });
    setValue('olimpista.colegio', '');
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.prov = parseInt(province_id, 10);
    formData.olimpista.colegio = '';
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

  const handleColegioChange = (school_id: string) => {
    setValue('olimpista.colegio', school_id, { shouldValidate: true });
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.colegio = parseInt(school_id, 10);
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRegister = async (data: any) => {
    const payload = {
      olympist_ci: data.olimpista.ci,
      names: data.olimpista.name,
      surnames: data.olimpista.lastname,
      birthdate: data.olimpista.birthday,
      email: data.olimpista.email,
      tutor_ci: data.olimpista.citutor,
      phone: data.olimpista.phone,
      school: data.olimpista.colegio,
      grade_id: data.olimpista.grade,
    };

    try {
      await submitForm(payload);
      setConfirmationStatus('success');
      setConfirmationMessage(
        'Registro exitoso del olimpista. Si desea inscribir al olimpista en áreas de competencia, puede continuar con el siguiente paso.',
      );
    } catch (error: any) {
      console.error('Error al registrar al olimpista:', error);
      setConfirmationStatus('error');
      setConfirmationMessage(
        error.data?.message || 'Error al registrar al olimpista',
      );
    } finally {
      setShowConfirmationModal(true);
      setShowModal(false);
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    if (confirmationStatus === 'success') {
      window.location.reload();
    }
    setConfirmationStatus(null);
    setConfirmationMessage('');
  };

  const handleNextStep = () => {
    navigate('/olympian/register-selected-areas');
  };

  const onNextStep = () => {
    navigate('/olympian/register-tutor');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col items-center ">
        <form
          onSubmit={handleSubmit(() => setShowModal(true))}
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
                required: 'El número de cédula es obligatorio',
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
                  Este número de cédula ya está registrado. Si desea inscribir
                  al olimpista en áreas de competencia, puede continuar con el
                  siguiente paso.
                </p>
                <div className="mt-3 flex justify-end">
                  <Button
                    label="Ir a registro de olimpista en áreas de competencia"
                    onClick={() => navigate(`/register-selected-areas`)}
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
                  required: 'El nombre es obligatorio',
                  pattern: {
                    value: /^[A-Za-zÑñÁÉÍÓÚáéíóú]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú]+)*$/,
                    message:
                      'Solo se permiten letras y un solo espacio entre palabras',
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
                  required: 'El apellido es obligatorio',
                  pattern: {
                    value: /^[A-Za-zÑñÁÉÍÓÚáéíóú]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú]+)*$/,
                    message:
                      'Solo se permiten letras y un solo espacio entre palabras',
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
                  required: 'La fecha de nacimiento es obligatoria',
                  validate: (value: string) => {
                    if (!value) return 'La fecha de nacimiento es obligatoria';
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
                      'Debe tener entre 6 y 18 años'
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
                  required: 'El correo electrónico es obligatorio',
                  pattern: {
                    value:
                      /^[a-zA-Z0-9](?!.*[._-]{2})(\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*\.[a-zA-Z]{2,}$/,
                    message: 'Correo electrónico no válido.',
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
                    required: 'El número de cédula es obligatorio',
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
                    required: 'El número de celular es obligatorio',
                    pattern: {
                      value: /^[0-9]{8,}$/,
                      message: 'Debe contener solo números y al menos 8 dígitos',
                    },
                    maxLength: {
                      value: 15,
                      message: 'Debe contener como máximo 15 dígitos',
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
                        id: departamento.department_id.toString(),
                        name: departamento.department_name,
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
                  required: 'El departamento es obligatorio',
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
                          id: provincia.province_id.toString(),
                          name: provincia.province_name,
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
                    required: 'La provincia es obligatoria',
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
                          id: colegio.school_id.toString(),
                          name: colegio.school_name,
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
                    required: 'La unidad educativa es obligatoria',
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
                        id: grado.grade_id.toString(),
                        name: grado.grade_name,
                      }))
                    : []
                }
                register={register}
                displayKey="name"
                valueKey="id"
                {...register('olimpista.grade', {
                  required: 'El grado es obligatorio',
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
                    onClick={() => navigate('/')}
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
                    onClick={() => navigate('/olympian')}
                  />
                </div>
              )}
            </div>
          </div>
        </form>
        {showModal && (
          <Modal
            onClose={() => setShowModal(false)}
            text="¿Estás seguro de que deseas registrar esta información?"
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
                ? 'Ir a registro de olimpista en áreas de competencia'
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
