import { Button, Dropdown, InputText } from '../../../components';
import { useForm } from "react-hook-form";
import { useFormContext } from 'react-hook-form';

export default function FormTutor() {
  const {
    register,
    formState: { errors },
  } = useFormContext(); 

  return (
    <div className="flex flex-col my-6">
      <div className="flex flex-col items-center justify-center flex-grow">
        <form className="max-w-9/12 mx-auto w-full px-0 sm:px-6 md:px-0">
          <h1 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center sm:text-left">
            Registro de Datos de Tutor
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <InputText
              label="Nombre(s)"
              name="tutor.name"
              placeholder="Carlos Santiago"
              className="w-full md:w-[400px]"
              register={register}
              validationRules={{
                required: "El nombre es obligatorio",
                pattern: {
                  value: /^(?! )[A-Za-zÑñÁÉÍÓÚáéíóú]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú]+)*(?<! )$/,
                  message: "Solo se permiten letras y un solo espacio entre palabras",
                },
              }}
              errors={errors}
            />
            <InputText
              label="Apellido(s)"
              name="tutor.lastname"
              placeholder="Paredes Soliz"
              className="w-full md:w-[400px]"
              register={register}
              validationRules={{
                required: "El apellido es obligatorio",
                pattern: {
                  value: /^(?! )[A-Za-zÑñÁÉÍÓÚáéíóú]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú]+)*(?<! )$/,
                  message: "Solo se permiten letras y un solo espacio entre palabras",
                },
              }}
              errors={errors}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <InputText
              label="Número de cédula de identidad"
              name="tutor.ci"
              placeholder="1234567"
              className="w-full md:w-[400px]"
              register={register}
              validationRules={{
                required: "El número de cédula es obligatorio",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo se permiten números",
                },
              }}
              errors={errors}
            />
            <InputText
              label="Número de celular"
              name="tutor.phone"
              placeholder="77777777"
               className="w-full md:w-[400px]"
              register={register}
              validationRules={{
                required: "El número de celular es obligatorio",
                pattern: {
                  value: /^[0-9]{8,}$/,
                  message: "Debe contener solo números y al menos 8 dígitos",
                },
              }}
              errors={errors}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputText
              label="Correo electrónico"
              name="tutor.email"
              placeholder="carlos@gmail.com"
              type="email"
              className="w-full md:w-[400px]"
              register={register}
              validationRules={{
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo electrónico no válido",
                },
              }}
              errors={errors}
            />
            <Dropdown
              label="Rol/Parentesco"
              name="tutor.rol"
              placeholder="Seleccionar rol o parentesco"
              className="w-full h-[50px] md:w-[400px]"
              options={[{ id: "2024", name: "2024" }, { id: "2025", name: "2025" }]}
              displayKey="name"
              valueKey="id"
              register={register}
              errors={errors}
              validationRules={{
                required: "El rol/parentesco es obligatorio", 
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}