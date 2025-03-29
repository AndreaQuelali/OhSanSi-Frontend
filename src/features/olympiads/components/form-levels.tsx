import { Button, Dropdown, InputText } from '../../../components';
import AddIcon from '../icons/add';
import { Table } from './table';
import { useForm } from "react-hook-form";
import { useEffect } from "react";

type FormData = {
  area: string;
  level: string;
  gmin: string;
  gmax: string;
};

export default function FormLevels() {

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<FormData>({
    mode: "onChange", 
    defaultValues: {
      area: "",
      gmin: "",
      gmax: "",
    },
  });

  const minGrade = watch("gmin");

  useEffect(() => {
    if (minGrade) {
      trigger("gmax");
    }
  }, [minGrade, trigger]);

  const onSubmit = (data: FormData) => {
    console.log("Formulario enviado con éxito:", data);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center flex-grow">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-9/12 mx-auto w-full">
          <h1 className="text-center text-primary mb-10 headline-lg">
            Registro de Niveles/Categorías de Olimpiada
          </h1>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-12">
            <Dropdown
              name="area"
              label="Área"
              placeholder="Seleccionar área"
              options={[{ id: "M", name: "Matemática" }, { id: "F", name: "Física" }]}
              displayKey="name"
              valueKey="id"
              register={register}
              validationRules={{
                required: "", 
              }}
              errors={errors}
            />
            <InputText
              label="Nivel/Categoría"
              name="level"
              placeholder="Ingresar nivel/categoria"
              type="text"
              register={register}
              validationRules={{
                pattern: {
                  value: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/,
                  message: "Solo se permiten caracteres alfanuméricos",
                },
                required: "Debe ingresar un nivel/categoría",
              }}
              errors={errors}
            />
            <Dropdown
              name="gmin"
              label="Grado Min."
              placeholder="Seleccionar grado min"
              options={[{ id: "1", name: "1" }, { id: "2", name: "2" }]}
              displayKey="name"
              valueKey="id"
              register={register}
              validationRules={{
                required: "", 
              }}
              errors={errors}
            />
            <Dropdown
              name="gmax"
              label="Grado Max."
              placeholder="Seleccionar grado max"
              options={[{ id: "1", name: "1" }, { id: "2", name: "2" }]}
              displayKey="name"
              valueKey="id"
              register={register}
              validationRules={{
                validate: (value: string) => {
                  if (!minGrade) return "Debe seleccionar primero el grado mínimo";
                  if (parseInt(value) <= parseInt(minGrade)) {
                    return "El grado máximo debe ser mayor al grado mínimo";
                  }
                  return true;
                },
              }}
              errors={errors}
              isRequired={false}
            />
          </div>
          <Button label="Agregar" className="w-full " icon={AddIcon} type="submit"  disabled={!isValid} variantColor={!isValid ? "variantDesactivate" : "variant1"} />
          <div className='w-full'>
            <Table />
          </div>
          <div className="mx-auto w-full flex justify-end gap-4">
            <Button label="Cancelar" variantColor="variant2" />
            <Button label="Registrar"/>
          </div>
        </form>
      </div>
    </div>
  );
}
