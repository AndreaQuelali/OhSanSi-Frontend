import { Dropdown, InputText } from '../../../components';
import { useFormContext } from "react-hook-form"; 

export default function FormDataPart() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext(); // Usar useFormContext para acceder al contexto del formulario

  const selectedDepartment = watch("olimpista.depa");
  console.log("Departamento seleccionado:", selectedDepartment);

  return (
    <div className="flex flex-col my-6">
      <div className="flex flex-col flex-grow">
        <form className="max-w-9/12 mx-auto w-full px-0 sm:px-6 md:px-0 lg:px-0">
          <h2 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center sm:text-left">
            Registro de Datos de Olimpista
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <InputText
              label="Nombre(s)"
              name="olimpista.name"
              placeholder="Lucia Damaris"
              className="w-full md:w-2xs"
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
              name="olimpista.lastname"
              placeholder="Quiroz Lopez"
              className="w-full md:w-2xs"
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
              name="olimpista.ci"
              placeholder="1234567"
              className="w-full md:w-2xs"
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
              name="olimpista.email"
              placeholder="lucia@gmail.com"
              type="email"
              className="w-full md:w-2xs"
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
              name="olimpista.phone"
              placeholder="77777777"
              className="w-full md:w-2xs"
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
              name="olimpista.birthday"
              placeholder="DD/MM/AAAA"
              type="date"
              className="w-full md:w-2xs"
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
              name="olimpista.school"
              placeholder="Seleccionar unidad educativa"
              className="w-full md:w-2xs"
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
              name="olimpista.grade"
              placeholder="Seleccionar curso"
              className="w-full md:w-2xs"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Dropdown
              label="Departamento"
              name="olimpista.depa"
              placeholder="Seleccionar departamento"
              className="w-full md:w-[430px]"
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
                name="olimpista.prov"
                placeholder="Seleccionar provincia"
                className="w-full md:w-[430px]"
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
                disabled={!selectedDepartment || selectedDepartment === ""}
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