import { Dropdown, InputText } from '../../../components';
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  lastname: string;
  ci: number;
  email: string;
  phone: number;
  birthday: string;
  school: string;
  grade: string;
  depa: string;
  prov: string;
};

export default function FormDataPart() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    watch,
  } = useForm<FormData>({
    mode: "onChange", 
    defaultValues: {
      depa: "",
      prov: "",
      grade: "",
    },
  });

  const selectedDepartment = watch("depa");

  const onSubmit = (data: FormData) => {
    console.log("Formulario enviado con éxito:", data);
  };

  return (
    <div className="flex flex-col my-6">
      <div className="flex flex-col flex-grow">
        <form className="max-w-9/12 mx-auto w-full">
          <h2 className=" text-primary  headline-md mb-2">
            Registro de Datos de Olimpista
          </h2>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-6">
            <InputText
              label="Nombre(s)"
              name="name"
              placeholder="Lucia Damaris"
              className="w-2xs"
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
              name="lastname"
              placeholder="Quiroz Lopez"
              className="w-2xs"
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
            <InputText
              label="Número de cédula de identidad"
              name="ci"
              placeholder="1234567"
              className="w-2xs"
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
          </div>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-6">
            <InputText
              label="Correo electrónico"
              name="email"
              placeholder="lucia@gmail.com"
              type="email"
              className="w-2xs"
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
            <InputText
              label="Número de celular"
              name="phone"
              placeholder="77777777"
              className="w-2xs"
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
            <InputText
              label="Fecha de nacimiento"
              name="birthday"
              placeholder="DD/MM/AAAA"
              type="date"
              className="w-2xs"
              register={register}
              validationRules={{
                required: "La fecha de nacimiento es obligatoria",
              }}
              errors={errors}
            />
          </div>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-6">
            <InputText
              label="Unidad educativa"
              name="school"
              placeholder="Seleccionar unidad educativa"
              className="w-[620px]"
              register={register}
              errors={errors}
              validationRules={{
                pattern: {
                  value: /^(?! )[A-Za-zÑñÁÉÍÓÚáéíóú0-9]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú0-9]+)*(?<! )$/,
                  message: "Solo se permiten letras, números y un solo espacio entre palabras",
                },
                required: "La unidad educativa es obligatoria", 
              }}
            />
            <Dropdown
              label="Curso"
              name="grade"
              placeholder="Seleccionar curso"
              className="w-2xs"
              options={[{ id: "2024", name: "2024" }, { id: "2025", name: "2025" }]}
              displayKey="name"
              valueKey="id"
              register={register}
              errors={errors}
              validationRules={{
                required: "El curso es obligatorio", 
              }}
            />
          </div>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between">
            <Dropdown
              label="Departamento"
              name="depa"
              placeholder="Seleccionar departamento"
              className="w-[430px]"
              options={[
                { id: "la-paz", name: "La Paz" },
                { id: "cochabamba", name: "Cochabamba" },
                { id: "santa-cruz", name: "Santa Cruz" },
              ]}
              displayKey="name"
              valueKey="id"
              register={register}
              errors={errors}
              validationRules={{
                required: "El departamento es obligatorio", 
              }}
            />
            <div>
              <Dropdown
                label="Provincia"
                name="prov"
                placeholder="Seleccionar provincia"
                className="w-[430px]"
                options={[
                  { id: "provincia1", name: "Provincia 1" },
                  { id: "provincia2", name: "Provincia 2" },
                ]}
                displayKey="name"
                valueKey="id"
                register={register}
                errors={errors}
                validationRules={{
                  required: "La provincia es obligatoria", 
                }}
                disabled={!selectedDepartment}
              />
              <div className='h-[25px]'>
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
