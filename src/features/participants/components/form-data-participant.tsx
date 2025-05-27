import { useFetchData } from '@/hooks/use-fetch-data';
import { Button, Dropdown, InputText, Modal } from '../../../components';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { API_URL } from '@/config/api-config';
import {
  Departamento,
  Grado,
  Provincia,
  UnidadEducativa, FormValues,
} from '../interfaces/register-participants';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useApiForm } from '@/hooks/use-api-form';
import { debounce } from 'lodash';

export default function FormDataPart() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({ mode: 'onChange' });
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { data: grados, loading } = useFetchData<Grado[]>('/grados');
  const { submitForm } = useApiForm('/olimpistas');

  const { data: departamentos, loading: loadingDepartamentos } =
    useFetchData<Departamento[]>('/departamentos');

  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(false);

  const [colegios, setColegios] = useState<UnidadEducativa[]>([]);
  const [loadingColegios, setLoadingColegios] = useState(false);

  const selectedDepartment = watch('olimpista.depa');
  const selectedProv = watch('olimpista.prov');

  const ci = watch('olimpista.ci');
  const citutor = watch('olimpista.citutor');

  const existingOlimpista = watch('olimpista.existing');const [showFormFields, setShowFormFields] = useState(false);
  const [formKey, setFormKey] = useState('');
  const resetDataRef = useRef<any | null>(null);
  const prevCiWasRegisteredRef = useRef(false);

  const reanimateFormFields = () => {
    setShowFormFields(false);
    setTimeout(() => {
      setShowFormFields(true);
    }, 50);
  };

  useEffect(() => {
    if (showFormFields && resetDataRef.current) {
      const currentCi = getValues('olimpista.ci');
      const incomingCi = resetDataRef.current.olimpista?.ci;
      const shouldReset = !incomingCi || incomingCi === currentCi;

      if (shouldReset) {
        reset({
          ...resetDataRef.current,
          olimpista: {
            ...resetDataRef.current.olimpista,
            ci: currentCi,
          },
        });

        if (resetDataRef.current.olimpista?.existing) {
          setError('olimpista.ci', {
            type: 'manual',
            message: 'Este número de cédula ya está registrado.',
          });
        }
      }

      resetDataRef.current = null;
    }
  }, [showFormFields]);

  const debouncedCheckCiRef = useRef(
    debounce(async (ciValue: string) => {
      if (!ciValue || ciValue.length < 4 || ciValue.length > 8) return;

      try {
        const response = await axios.get(`${API_URL}/olimpistas/cedula/${ciValue}`);

        if (response.data) {
          const data = response.data;
          prevCiWasRegisteredRef.current = true;

          setError('olimpista.ci', {
            type: 'manual',
            message: 'Este número de cédula ya está registrado.',
          });

          resetDataRef.current = {
            olimpista: {
              ci: data.ci,
              name: data.nombres,
              lastname: data.apellidos,
              email: data.correo_electronico,
              birthday: data.fecha_nacimiento,
              phone: data.celular,
              citutor: data.ci_tutor_legal,
              depa: data.id_departamento,
              prov: data.id_provincia,
              colegio: data.id_colegio,
              grade: data.id_grado,
              existing: true,
            },
          };

          setFormKey(ciValue);
          reanimateFormFields();
        } else {
          const currentError = errors?.olimpista?.ci?.type;
          if (currentError === 'manual') {
            clearErrors('olimpista.ci');
          }

          if (!showFormFields) {
            setShowFormFields(true);
          }

          if (prevCiWasRegisteredRef.current) {
            prevCiWasRegisteredRef.current = false;

            resetDataRef.current = {
              olimpista: {
                ci: ciValue,
                name: '',
                lastname: '',
                email: '',
                birthday: '',
                phone: '',
                citutor: '',
                depa: '',
                prov: '',
                colegio: '',
                grade: '',
                existing: false,
              },
            };

            setFormKey(ciValue);
            reanimateFormFields();
          }
        }
      } catch (error) {
        console.error('Error al verificar el CI:', error);

        const currentError = errors?.olimpista?.ci?.type;
        if (currentError === 'manual') {
          clearErrors('olimpista.ci');
        }

        if (!showFormFields) {
          setShowFormFields(true);
        }

        if (prevCiWasRegisteredRef.current) {
          prevCiWasRegisteredRef.current = false;

          resetDataRef.current = {
            olimpista: {
              ci: ciValue,
              name: '',
              lastname: '',
              email: '',
              birthday: '',
              phone: '',
              citutor: '',
              depa: '',
              prov: '',
              colegio: '',
              grade: '',
              existing: false,
            },
          };

          setFormKey(ciValue);
          reanimateFormFields();
        }
      }
    }, 500)
  );

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
        const response = await axios.get(
          `${API_URL}/tutores/cedula/${ciTutorValue}`,
        );
        if (response.data) {
          clearErrors('olimpista.citutor');
        } else {
          setError('olimpista.citutor', {
            type: 'manual',
            message: 'Este CI de tutor no está registrado.',
          });
        }
      } catch {
        setError('olimpista.citutor', {
          type: 'manual',
          message: 'Este CI de tutor no está registrado.',
        });
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
            `${API_URL}/provincias/${selectedDepartment}`,
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
            `${API_URL}/colegios/${selectedProv}`,
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

  const handleDepartamentoChange = (id_departamento: string) => {
    setValue('olimpista.depa', id_departamento, { shouldValidate: true });
    setValue('olimpista.prov', '');
    setValue('olimpista.colegio', '');
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.depa = parseInt(id_departamento, 10);
    formData.olimpista.prov = '';
    formData.olimpista.colegio = '';
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

  const handleGradoChange = (id_grado: string) => {
    setValue('olimpista.grade', id_grado, { shouldValidate: true });
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.grade = parseInt(id_grado, 10);
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

  const handleProvinciaChange = (id_provincia: string) => {
    setValue('olimpista.prov', id_provincia, { shouldValidate: true });
    setValue('olimpista.colegio', '');
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.prov = parseInt(id_provincia, 10);
    formData.olimpista.colegio = '';
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

  const handleColegioChange = (id_colegio: string) => {
    setValue('olimpista.colegio', id_colegio, { shouldValidate: true });
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.colegio = parseInt(id_colegio, 10);
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRegister = async (data: any) => {
    const payload = {
      cedula_identidad: data.olimpista.ci,
      nombres: data.olimpista.name,
      apellidos: data.olimpista.lastname,
      fecha_nacimiento: data.olimpista.birthday,
      correo_electronico: data.olimpista.email,
      ci_tutor: data.olimpista.citutor,
      celular: data.olimpista.phone,
      unidad_educativa: data.olimpista.colegio,
      id_grado: data.olimpista.grade,
    };

    console.log('Datos que se enviarán:', payload);

    try {
      const response = await submitForm(payload);
      console.log('Se envio correctamente', response);
      alert('Olimpista registrado correctamente');
      window.location.reload();
    } catch (error) {
      console.error('Error al registrar al olimpista:', error);
      alert('Error al registrar al olimpista');
    }
  };

  return (
    <div className="flex flex-col w-full h-full mr-10">
      <div className="flex flex-col items-center ">
        <form
          onSubmit={handleSubmit(() => setShowModal(true))}
          className="mx-5 mt-10 mb-32 md:w-9/12 lg:w-9/12"
        >
          <h1 className="text-primary headline-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center">
            Registro de Datos de Olimpista
          </h1>
          <h2 className="text-primary headline-sm mb-2 ">Datos personales</h2>
          <h2 className="text-primary subtitle-sm mb-2 ">Primero ingrese el número de cédula de identidad del olimpista a registrar</h2>
          <div className="grid grid-cols-1 lg:gap-9 mb-6">
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
            key={formKey}
            className={`
              transition-all duration-500 ease-in-out transform overflow-hidden
              ${showFormFields
                ? 'opacity-100 translate-y-0 max-h-full pointer-events-auto'
                : 'opacity-0 -translate-y-10 max-h-0 pointer-events-none'}
            `}
          >
            {existingOlimpista && (
              <div className="bg-surface border-l-4 subtitle-sm border-primary text-onBack p-4 mb-6 rounded">
                <p>
                  Este número de cédula ya está registrado. Si deseas inscribir a este olimpista
                  en áreas de competencia, puedes continuar con el siguiente paso.
                </p>
                <div className="mt-3 flex justify-end">
                  <Button
                    label="Ir a registro de olimpista en áreas de competencia"
                    onClick={() => navigate(`/register-selected-areas`)}
                    variantColor="variant4"
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 mb-6">
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
                readOnly={existingOlimpista}
                disabled={existingOlimpista}
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
                readOnly={existingOlimpista}
                disabled={existingOlimpista}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-9 mb-6">
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
                readOnly={existingOlimpista}
                disabled={existingOlimpista}
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
                      /^[a-zA-Z0-9](?!.*[._-]{2})(\.?[a-zA-Z0-9_-])*[a-zA-Z0-9.]@[a-zA-Z0-9](-?[a-zA-Z0-9])*\.[a-zA-Z]{2,}$/,
                    message: 'Correo electrónico no válido.',
                  },
                }}
                errors={errors}
                readOnly={existingOlimpista}
                disabled={existingOlimpista}
              />
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
                readOnly={existingOlimpista}
                disabled={existingOlimpista}
              />
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
                  }}
                  errors={errors}
                  readOnly={existingOlimpista}
                  disabled={existingOlimpista}
                />
              )}
            </div>
            <h2 className="text-primary headline-sm mb-2">Datos académicos</h2>
            <div className="grid md:grid-cols-2 md:gap-9 mb-6">
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
                disabled={loadingDepartamentos || existingOlimpista}
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
                  disabled={loadingProvincias || existingOlimpista}
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
                  disabled={loadingColegios || existingOlimpista}
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
                        id: grado.id_grado.toString(),
                        name: grado.nombre_grado,
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
                disabled={loading || existingOlimpista}
                errors={errors}
              />
            </div>
            {!existingOlimpista && (
              <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
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
              </div>
            )}

            {existingOlimpista && (
              <div className="flex justify-end mt-5">
                <Button
                  label="Cancelar"
                  variantColor="variant2"
                  onClick={() => navigate('/')}
                />
              </div>
            )}
          </div>
        </form>
        {showModal && (
          <Modal
            onClose={() => setShowModal(false)}
            text="¿Estás seguro de que deseas registrar esta información?"
            onConfirm={handleSubmit(handleRegister)}
          />
        )}
      </div>
    </div>
  );
}
