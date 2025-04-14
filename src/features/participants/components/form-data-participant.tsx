import { useFetchData } from '@/hooks/use-fetch-data';
import { Button, Dropdown, InputText } from '../../../components';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { API_URL } from '@/config/api-config';
import {
  Departamento,
  Grado,
  Provincia,
  UnidadEducativa,
} from '../interfaces/register-participants';
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function FormDataPart() {
  const {
    register,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid },
    watch,
  } = useFormContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { data: grados, loading } = useFetchData<Grado[]>('/grados');

  const { data: departamentos, loading: loadingDepartamentos } =
    useFetchData<Departamento[]>('/departamentos');

  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(false);

  const selectedDepartment = watch('olimpista.depa');
  const selectedProv = watch('olimpista.prov');

  const [colegios, setColegios] = useState<UnidadEducativa[]>([]);
  const [loadingColegios, setLoadingColegios] = useState(false);

  const ci = watch('olimpista.ci'); // Observar el campo CI
  const email = watch('olimpista.email'); // Observar el campo Email

  const checkCi = async () => {
    if (!ci) {
      clearErrors('olimpista.ci'); // Limpiar el error si el campo está vacío
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/olimpistas/cedula/${ci}`);
      if (response.data) {
        setError('olimpista.ci', {
          type: 'manual',
          message: 'Este número de cédula ya está registrado.',
        });
      } else {
        clearErrors('olimpista.ci'); // Limpiar el error si no existe
      }
    } catch (error) {
      console.error('Error al verificar el CI:', error);
      clearErrors('olimpista.ci'); // No mostrar error si ocurre un problema en la verificación
    }
  };

  const checkEmail = async () => {
    if (!email) {
      clearErrors('olimpista.email'); // Limpiar el error si el campo está vacío
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/olimpistas/email/${email}`);
      if (response.data) {
        setError('olimpista.email', {
          type: 'manual',
          message: 'Este correo electrónico ya está registrado.',
        });
      } else {
        clearErrors('olimpista.email'); // Limpiar el error si no existe
      }
    } catch (error) {
      console.error('Error al verificar el correo:', error);
      clearErrors('olimpista.email'); // No mostrar error si ocurre un problema en la verificación
    }
  };
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

  useEffect(() => {
    const fetchColegios = async () => {
      setLoadingColegios(true);
      try {
        const response = await axios.get(`${API_URL}/colegios`);
        setColegios(response.data);
      } catch (error) {
        console.error('Error al cargar los colegios:', error);
        setColegios([]);
      } finally {
        setLoadingColegios(false);
      }
    };

    fetchColegios();
  }, []);

  const handleDepartamentoChange = (id_departamento: string) => {
    setValue('olimpista.depa', id_departamento, { shouldValidate: true });
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.depa = parseInt(id_departamento, 10);
    localStorage.setItem('participantData', JSON.stringify(formData));
    setValue('olimpista.prov', '');
    setValue('olimpista.colegio', '');
  };

  const handleGradoChange = (id_grado: string) => {
    setValue('olimpista.grade', id_grado, { shouldValidate: true });
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.grade = parseInt(id_grado, 10); // Guarda el id_grado como número
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

  const handleProvinciaChange = (id_provincia: string) => {
    setValue('olimpista.prov', id_provincia, { shouldValidate: true });
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.prov = parseInt(id_provincia, 10);
    localStorage.setItem('participantData', JSON.stringify(formData));
    setValue('olimpista.colegio', '');
  };

  const handleColegioChange = (id_colegio: string) => {
    setValue('olimpista.colegio', id_colegio, { shouldValidate: true });
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.colegio = parseInt(id_colegio, 10);
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

  return (
    <div className="flex flex-col my-6">
      <div className="flex flex-col items-center flex-grow">
        <form>
          <h1 className="text-primary headline-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center">
            Registro de Datos de Olimpista
          </h1>
          <h2 className="text-primary headline-sm mb-2 ">Datos personales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-9 mb-6">
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
                onBlur: checkCi, // Verificar CI al salir del campo
              }}
              errors={errors}
            />
            <InputText
              label="Nombre(s)"
              name="olimpista.name"
              placeholder="Ingresar nombres"
              className="w-full"
              register={register}
              validationRules={{
                required: 'El nombre es obligatorio',
                pattern: {
                  value:
                    /^(?! )[A-Za-zÑñÁÉÍÓÚáéíóú]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú]+)*(?<! )$/,
                  message:
                    'Solo se permiten letras y un solo espacio entre palabras',
                },
              }}
              errors={errors}
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
                  value:
                    /^(?! )[A-Za-zÑñÁÉÍÓÚáéíóú]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú]+)*(?<! )$/,
                  message:
                    'Solo se permiten letras y un solo espacio entre palabras',
                },
              }}
              errors={errors}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-9 mb-6">
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
                    (exactAge >= 6 && exactAge <= 20) ||
                    'Debe tener entre 6 y 20 años'
                  );
                },
              }}
              errors={errors}
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
                    /^(?!.*\.\.)(?!.*\.@)(?!^\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
                  message: 'Correo electrónico no válido',
                },
                onBlur: checkEmail, // Verificar correo al salir del campo
              }}
              errors={errors}
            />
            <InputText
              label="Cédula de identidad del tutor legal"
              name="tutor.ci"
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
                onBlur: checkCi,
              }}
              errors={errors}
            />
          </div>
          <h2 className="text-primary headline-sm mb-2">Datos académicos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 mb-6">
            <Dropdown
              label="Departamento"
              placeholder="Seleccionar departamento"
              className="w-full lg:w-[480px]"
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
              disabled={loadingDepartamentos}
              errors={errors}
              validationRules={{
                required: 'El departamento es obligatorio',
              }}
            />
            <div>
              <Dropdown
                label="Provincia"
                placeholder="Seleccionar provincia"
                className="w-full lg:w-[480px]"
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
                disabled={loadingProvincias}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 mb-6">
            <div>
              <Dropdown
                label="Unidad educativa"
                placeholder="Seleccionar unidad educativa"
                className="w-full lg:w-[480px]"
                options={colegios.map((colegio) => ({
                  value: colegio.id_colegio.toString(),
                  label: colegio.nombre_colegio,
                }))}
                displayKey="name"
                valueKey="id"
                register={register}
                {...register('olimpista.colegio', {
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleColegioChange(e.target.value),
                })}
                disabled={loading}
                errors={errors}
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
              className="w-full lg:w-[480px]"
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
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleGradoChange(e.target.value),
              })}
              disabled={loading}
              errors={errors}
            />
          </div>
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
              disabled={!isValid}
              variantColor={!isValid ? 'variantDesactivate' : 'variant1'}
            />
          </div>
        </form>
        {showModal && (
          <Modal
            onClose={onCloseModal}
            text="¿Estás seguro de que deseas registrar esta información?"
            onConfirm={onConfirm}
          />
        )}
      </div>
    </div>
  );
}
