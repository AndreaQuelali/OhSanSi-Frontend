import { Button, InputText } from '../../../components';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import CardUploadImage from './card-upload-image';
import { TableAreas } from './table-areas';

type FormData = {
  inputArea: string;
};

type TableRow = {
  id: number;
  area: string;
};

const FormAreas = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const [image, setImage] = useState<File | null>(null); // Estado para la imagen
  const [rows, setRows] = useState<TableRow[]>([]); // Estado para la tabla
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = (data: FormData) => {
    if (!image) {
      return; // Evita el envío si no hay imagen
    }

    setErrorMessage(null);

    // Verificar si el área ya está en la tabl
    const isDuplicate = rows.some(
      (row) => row.area.toLowerCase() === data.inputArea.toLowerCase(),
    );
    if (isDuplicate) {
      setErrorMessage('Esta área ya se encuentra agregada');
      return;
    }

    const newRow: TableRow = {
      id: Date.now(),
      area: data.inputArea,
    };

    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <div className="w-full flex items-center justify-center my-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <h1 className="text-center headline-lg text-primary">
            Registro de Áreas de Competencia de Olimpiada
          </h1>
          <h1 className="text-center headline-md text-primary">Gestión 2025</h1>
          <div className="flex flex-row justify-between my-7 gap-9">
            <div>
              <InputText
                label="Nombre del Área"
                name="inputArea"
                placeholder="Ingrese nombre del área"
                type="text"
                className="w-[500px]"
                labelPadding="py-5"
                register={register}
                errors={errors}
                validationRules={{
                  required: 'El nombre es obligatorio',
                  pattern: {
                    value:
                      /^(?!-)(?! )[A-Za-zÑñÁÉÍÓÚáéíóú-]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú-]+)*(?<!-)(?<! )$/,
                    message:
                      'Solo se permiten letras, guion en medio y un solo espacio entre palabras',
                  },
                }}
              />
            </div>
            <div className="w-[500px]">
              <CardUploadImage onChange={setImage} />{' '}
              {/* Pasamos la función que actualiza el estado */}
            </div>
          </div>
          <Button
            type="submit"
            label="Agregar"
            disabled={!isValid || !image} // Deshabilita si no es válido o no hay imagen
            variantColor={
              !isValid || !image ? 'variantDesactivate' : 'variant1'
            }
          />
          <div className="min-h-[24px] flex mt-2">
            {errorMessage && (
              <p className="text-error subtitle-sm">{errorMessage}</p>
            )}
          </div>
          <div className="w-full min-h-[10px]">
            <TableAreas data={rows} onDeleteRow={handleDeleteRow} />
          </div>
          <div className="flex flex-row justify-end space-x-5">
            <Button label="Cancelar" variantColor="variant2" />
            <Button
              label="Registrar"
              disabled={rows.length === 0}
              variantColor={
                rows.length === 0 ? 'variantDesactivate' : 'variant1'
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormAreas;
