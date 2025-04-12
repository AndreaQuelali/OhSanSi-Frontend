import IconFile from "@/components/icons/icon-file";
import IconNoFile from "@/components/icons/icon-no-file";
import { useState, forwardRef } from "react";

interface Props {
  fileName: string | null;
  setFileName: (name: string | null) => void;
}

const CardUploadFile = forwardRef<HTMLInputElement, Props>(({ fileName, setFileName }, ref) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel")
    ) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel")
    ) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
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
        className={`flex flex-col items-center justify-center p-6 border-2 ${
          dragActive ? "border-secondary2" : "border-neutral2"
        } border-dashed rounded-xl cursor-pointer transition duration-200`}
      >
        <div className="flex flex-row items-center gap-5">
          <div>
            {fileName ? <IconFile /> : <IconNoFile />}
          </div>
          <div>
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
        />
      </label>
    </div>
  );
});

export default CardUploadFile;
