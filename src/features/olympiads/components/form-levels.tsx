import { Button, Dropdown, InputText } from '../../../components';
import AddIcon from '../icons/add';
import { Table } from './table';
import { useForm } from "react-hook-form";

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
              options={[{ id: 1, name: 'Option 1' }]}
              displayKey={'1,2,3'}
              valueKey={'r,t,y'}
              register={register}
            />
            <InputText
              label="Nivel/Categoría"
              name="level"
              placeholder="Ingresar nivel/categoria"
              type="text"
              register={register}
            />
            <Dropdown
              name="gmin"
              label="Grado Min."
              placeholder="Seleccionar grado min"
              options={[{ id: 1, name: 'Option 1' }]}
              displayKey={'1,2,3'}
              valueKey={'r,t,y'}
              register={register}
            />
            <Dropdown
              name="gmax"
              label="Grado Max."
              placeholder="Seleccionar grado max"
              options={[{ id: 1, name: 'Option 1' }]}
              displayKey={'1,2,3'}
              valueKey={'r,t,y'}
              register={register}
            />
          </div>
          <Button label="Agregar" className="w-full " icon={AddIcon} />
          <Table />
          <div className="max-w-9/12 mx-auto w-full flex justify-end gap-4">
            <Button label="Cancelar" variantColor="variant2" />
            <Button type="submit" label="Registrar" disabled={!isValid} variantColor={!isValid ? "variantDesactivate" : "variant1"} />
          </div>
        </form>
      </div>
    </div>
  );
}
