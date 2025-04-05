import axios from 'axios';
import { Dropdown, InputText } from '../../../components';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';

export default function FormTutor() {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();

  const [tutorExists, setTutorExists] = useState(false);
  const [, setLoading] = useState(false);

  const ci = watch('tutor.ci');
  const rol = watch('tutor.rol');

  const checkTutor = async () => {
    if (!ci) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/tutores?ci=${ci}`,
      );
      if (response.data.tutor) {
        const tutor = response.data.tutor;

        setValue('tutor.name', tutor.nombres);
        setValue('tutor.lastname', tutor.apellidos);
        setValue('tutor.phone', tutor.celular.toString());
        setValue('tutor.email', tutor.correo_electronico);
        setValue('tutor.rol', tutor.rol_parentesco);

        setTutorExists(true);
      } else {
        setTutorExists(false);
      }
    } catch (error) {
      console.error('Error al verificar el tutor:', error);
      setTutorExists(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col my-6">
      <div className="flex flex-col items-center flex-grow">
        <form>
          <h1 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center sm:text-left">
            Registro de Datos de Tutor
          </h1>
          {tutorExists && (
            <p className="text-success text-sm">
              Este tutor ya está registrado. Los campos se han completado
              automáticamente.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <InputText
              label="Número de cédula de identidad"
              name="tutor.ci"
              placeholder="1234567"
              className="w-full md:w-[400px]"
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
                onBlur: checkTutor,
              }}
              errors={errors}
            />
            <InputText
              label="Nombre(s)"
              name="tutor.name"
              placeholder="CARLOS SANTIAGO"
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 mb-6">
            <InputText
              label="Apellido(s)"
              name="tutor.lastname"
              placeholder="PAREDES ZURITA"
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
              label="Número de celular"
              name="tutor.phone"
              placeholder="77777777"
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
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 mb-6">
            <InputText
              label="Correo electrónico"
              name="tutor.email"
              placeholder="carlosparedes@gmail.com"
              type="email"
              className="w-full"
              register={register}
              validationRules={{
                required: 'El correo electrónico es obligatorio',
                pattern: {
                  value:
                    /^(?!.*\.\.)(?!.*\.@)(?!^\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
                  message: 'Correo electrónico no válido',
                },
              }}
              errors={errors}
            />
            <Dropdown
              label="Rol/Parentesco"
              placeholder="Seleccionar rol o parentesco"
              className="w-full"
              options={[
                { id: 1, rol_parentesco: 'Padre' },
                { id: 2, rol_parentesco: 'Madre' },
                { id: 3, rol_parentesco: 'Apoderado' },
                { id: 4, rol_parentesco: 'Tutor' },
              ]}
              displayKey="rol_parentesco"
              valueKey="rol_parentesco"
              register={register}
              name="tutor.rol"
              validationRules={{
                required: 'El rol/parentesco es obligatorio',
              }}
              value={rol}
              errors={errors}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
