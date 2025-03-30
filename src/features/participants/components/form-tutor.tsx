import { Button, Dropdown, InputText } from '../../../components';
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  lastname: string;
  ci: number;
  email: string;
  phone: number;
  rol: string;
};

export default function FormTutor() {

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<FormData>({
    mode: "onChange", 
    defaultValues: {
      
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Formulario enviado con éxito:", data);
  };

  return (
    <div className=" flex flex-col my-6">
      <div className="flex flex-col items-center justify-center flex-grow">
        <form className="max-w-9/12 mx-auto w-full">
          <h1 className=" text-primary mb-2 headline-md">
            Registro de Datos de Tutor
          </h1>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-6">
            <InputText
              label="Nombre(s)"
              name="name"
              placeholder="Carlos Santiago"
              className="w-[400px]"
              register={register}
              validationRules={{

              }}
              errors={errors}
            />
            <InputText
              label="Apellido(s)"
              name="lastname"
              placeholder="Paredes Soliz"
              className="w-[400px]"
              register={register}
              validationRules={{

              }}
              errors={errors}
            />
          </div>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-6">
            <InputText
              label="Número de cédula de identidad"
              name="ci"
              placeholder="1234567"
              className="w-[400px]"
              register={register}
              validationRules={{

              }}
              errors={errors}
            />
            <InputText
              label="Número de celular"
              name="phone"
              placeholder="77777777"
              className="w-[400px]"
              register={register}
              validationRules={{

              }}
              errors={errors}
            />
          </div>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-6">
            <InputText
              label="Correo electrónico"
              name="email"
              placeholder="carlos@gmail.com"
              type="email"
              className="w-[400px]"
              register={register}
              validationRules={{

              }}
              errors={errors}
            />
            <Dropdown
              label="Rol/Parentesco"
              name="rol"
              placeholder="Seleccionar rol o parentesco"
              className="w-[400px]"
              options={[{ id: "2024", name: "2024" }, { id: "2025", name: "2025" }]}
              displayKey="name"
              valueKey="id"
              register={register}
              errors={errors}
              validationRules={{
                required: "Debe seleccionar un año/gestión", 
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
