import { useFetchData } from '@/hooks/use-fetch-data';
import { Dropdown, InputText } from '../../../components';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { API_URL } from '@/config/api-config';
import {
  Departamento,
  Grado,
  Provincia,
} from '../interfaces/register-participants';

export default function FormDataPart() {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();
  const { data: grados, loading } = useFetchData<Grado[]>('/grados');

  const { data: departamentos, loading: loadingDepartamentos } =
    useFetchData<Departamento[]>('/departamentos');

  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(false);

  const selectedDepartment = watch('olimpista.depa');

  useEffect(() => {
    if (selectedDepartment) {
      const fetchProvincias = async () => {
        setLoadingProvincias(true);
        try {
          const response = await fetch(
            `${API_URL}/provincias/${selectedDepartment}`,
          );
          const data = await response.json();
          setProvincias(data);
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

  const handleDepartamentoChange = (id_departamento: string) => {
    setValue('olimpista.depa', id_departamento, { shouldValidate: true });
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.olimpista.depa = parseInt(id_departamento, 10);
    localStorage.setItem('participantData', JSON.stringify(formData));
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
  };

  return (
    <div className="flex flex-col my-6">
      <div className="flex flex-col items-center flex-grow">
        <form>
          <h2 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center sm:text-left">
            Registro de Datos de Olimpista
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-9 mb-6">
            <InputText
              label="Nombre(s)"
              name="olimpista.name"
              placeholder="LUCIA DAMARIS"
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
              placeholder="QUIROZ LOPEZ"
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
            <InputText
              label="Número de cédula de identidad"
              name="olimpista.ci"
              placeholder="1234567"
              className="w-full "
              register={register}
              validationRules={{
                required: 'El número de cédula es obligatorio',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Solo se permiten números',
                },
              }}
              errors={errors}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-9 mb-6">
            <InputText
              label="Correo electrónico"
              name="olimpista.email"
              placeholder="luciaquiroz@gmail.com"
              type="email"
              className="w-full"
              register={register}
              validationRules={{
                required: 'El correo electrónico es obligatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Correo electrónico no válido',
                },
              }}
              errors={errors}
            />
            <InputText
              label="Número de celular"
              name="olimpista.phone"
              placeholder="77777777"
              className="w-full "
              register={register}
              validationRules={{
                required: 'El número de celular es obligatorio',
                pattern: {
                  value: /^[0-9]{8,}$/,
                  message: 'Debe contener solo números y al menos 8 dígitos',
                },
              }}
              errors={errors}
            />
            <InputText
              label="Fecha de nacimiento"
              name="olimpista.birthday"
              placeholder="DD/MM/AAAA"
              type="date"
              className="w-full"
              register={register}
              validationRules={{
                required: 'La fecha de nacimiento es obligatoria',
              }}
              errors={errors}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 mb-6">
            <InputText
              label="Unidad educativa"
              name="olimpista.school"
              placeholder="Seleccionar unidad educativa"
              className="w-full"
              register={register}
              errors={errors}
              validationRules={{
                pattern: {
                  value:
                    /^(?! )[A-Za-zÑñÁÉÍÓÚáéíóú0-9]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú0-9]+)*(?<! )$/,
                  message:
                    'Solo se permiten letras, números y un solo espacio entre palabras',
                },
                required: 'La unidad educativa es obligatoria',
              }}
            />
            <Dropdown
              label="Grado"
              placeholder="Seleccionar grado"
              className="w-full"
              options={
                grados
                  ? grados.map((grado) => ({
                      id: grado.id_grado.toString(),
                      name: grado.nombre_grado,
                    }))
                  : []
              }
              displayKey="name"
              valueKey="id"
              register={register}
              {...register('olimpista.grade', {
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleGradoChange(e.target.value),
              })}
              disabled={loading}
              errors={errors}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Dropdown
              label="Departamento"
              placeholder="Seleccionar departamento"
              className="w-full md:w-[430px]"
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
                className="w-full md:w-[430px]"
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
              <div className="h-[25px]">
                {!selectedDepartment && (
                  <span className="text-neutral subtitle-sm">
                    Primero seleccione un departamento.
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
