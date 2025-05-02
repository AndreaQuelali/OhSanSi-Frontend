import { Button } from "@/components";
import CardUploadFile from "./card-upload-file";
import { useNavigate } from 'react-router';
import { useState, useRef } from "react";
import IconDownload from "@/components/icons/icon-download";

export default function FormDataExcel() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearFile = () => {
    setFileName(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // para poder volver a subir el mismo archivo
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form className="mx-5 mt-10 mb-32 md:w-9/12 lg:w-9/12">
        <h1 className="text-center text-primary mb-8 headline-lg">
          Registrar datos de olimpistas a través de archivo Excel
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-10 mb-5">
          <div className="flex flex-col">
            <CardUploadFile
              fileName={fileName}
              setFileName={setFileName}
              ref={inputRef}
            />
          <div className="flex flex-row items-center justify-start mt-2">
            <button
              type="button"
              onClick={() => {
                window.open('/templates/template-excel.xlsx', '_blank');
              }}
              className="flex items-center text-primary underline body-md hover:text-secondary2 transition cursor-pointer"
            >
              <IconDownload classname="h-5 w-5 mr-0.5" />
              Descargar plantilla Excel
            </button>
          </div>
          </div>
          <div className="flex flex-col w-full md:w-auto">
            {fileName ? (
              <Button
                label="Borrar archivo"
                variantColor="variant2"
                className="mt-5 md:mt-0"
                onClick={handleClearFile}
              />
            ) : (
              <Button
                label="Subir archivo"
                variantColor="variant1"
                className="mt-5 md:mt-0"
                onClick={handleUploadClick}
              />
            )}
          </div>
        </div>
        <p className="subtitle-md text-primary mb-5">
          Datos cargados:
        </p>
        <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
          <Button
            label="Cancelar"
            variantColor="variant2"
            className="mt-5 md:mt-0"
            onClick={() => navigate('/')}
          />
          <Button
            type="submit"
            label="Registrar"
            disabled={false}
            variantColor={'variant1'}
          />
        </div>
      </form>
    </div>
  );
}
