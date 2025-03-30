import { Button, Dropdown, InputText } from '../../../components';
import AddIcon from '../icons/add';
import { Table } from './table';
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

type FormData = {
  area: string;
  level: string;
  gmin: string;
  gmax: string;
};

type TableRow = {
  id: number;
  area: string;
  level: string;
  grade: string; // Combinamos gmin y gmax en una sola propiedad
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
  const [rows, setRows] = useState<TableRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (minGrade) {
      trigger("gmax");
    }
  }, [minGrade, trigger]);

  const onSubmit = (data: FormData) => {
    setErrorMessage(null);
    const isDuplicate = rows.some(row => row.area === data.area && row.level === data.level);
  
    if (isDuplicate) {
      setErrorMessage("Este nivel/categoría ya se encuentra agregado");
      return;
    }
  
    const newRow: TableRow = {
      id: Date.now(),
      area: data.area,
      level: data.level,
      grade: `${data.gmin} - ${data.gmax}`,
    };
  
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id)); 
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center flex-grow">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-9/12 mx-auto w-full">
          <h1 className="text-center text-primary mb-10 headline-lg">
            Registro de Niveles/Categorías de Olimpiada
          </h1>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-5">
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
          
          <div className="min-h-[24px] flex mt-2">
            {errorMessage && <p className="text-error subtitle-sm">{errorMessage}</p>}
          </div>
          <div className='w-full min-h-[220px] max-h-[300px]'>
            <Table data={rows} onDeleteRow={handleDeleteRow} />
          </div>
          <div className="mx-auto w-full flex justify-end gap-4">
            <Button label="Cancelar" variantColor="variant2" />
            <Button
              label="Registrar"
              disabled={rows.length === 0}
              variantColor={rows.length === 0 ? "variantDesactivate" : "variant1"}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
