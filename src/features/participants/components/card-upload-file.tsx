import IconFile from "@/components/icons/icon-file";
import IconNoFile from "@/components/icons/icon-no-file";
import { useState, forwardRef } from "react";

interface Props {
  fileName: string | null;
  setFileName: (name: string | null) => void;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}

const CardUploadFile = forwardRef<HTMLInputElement, Props>(
  ({ fileName, setFileName, onFileChange }, ref) => {
    const [dragActive, setDragActive] = useState(false);

    const isValidExcel = (file: File) =>
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";

    const isUnder3MB = (file: File) => file.size <= 3 * 1024 * 1024;
    
    const processFile = (file: File) => {
      if (!isValidExcel(file)) {
        alert("Archivo inválido. Solo se permiten archivos .xlsx o .xls");
        return;
      }

      if (!isUnder3MB(file)) {
        alert("Archivo demasiado grande. El tamaño máximo es 3 MB.");
        return;
      }

      setFileName(file.name);

      // Crear un evento falso y pasarlo a onFileChange si existe
      if (onFileChange) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const fakeEvent = {
          target: {
            files: dataTransfer.files,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        onFileChange(fakeEvent);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      processFile(file);
      e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      processFile(file);
    };

    return (
      <div className="w-full max-w-md mx-auto">
        <label
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition duration-200 ${
            dragActive
              ? "border-secondary2 bg-secondary2/25"
              : fileName
              ? "border-secondary2 bg-secondary2/5"
              : "border-neutral2 bg-transparent"
          }`}
        >
          <div className="flex flex-row items-center gap-5">
            <div>{fileName ? <IconFile /> : <IconNoFile />}</div>
            <div className="mr-2">
              <p className="subtitle-md text-onBack">
                {fileName ? fileName : "Ningún archivo seleccionado"}
              </p>
              <p className="body-md text-primary hover:text-secondary2 mt-1 underline transition">
                Selecciona o arrastra el archivo aquí
              </p>
            </div>
          </div>
          <input
            ref={ref}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
            onClick={(e) => ((e.target as HTMLInputElement).value = "")}
          />
        </label>
      </div>
    );
  }
);

export default CardUploadFile;
