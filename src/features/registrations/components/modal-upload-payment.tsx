import { Button, ButtonIcon } from '@/components';
import CloseIcon from '@/components/icons/close';
import IconFile from '@/components/icons/icon-file';
import IconNoFile from '@/components/icons/icon-no-file';
import { useRef, useState } from 'react';

export const ModalUploadPay = ({
  onClose,
  onConfirm,
  children,
}: ModalProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const isValidImage = (file: File) =>
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg';

  const isUnder3MB = (file: File) => file.size <= 3 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImage(file)) {
      alert('Archivo inválido. Solo se permiten imágenes (.jpg, .jpeg, .png)');
      if (ref.current) ref.current.value = '';
      return;
    }

    if (!isUnder3MB(file)) {
      alert('Archivo demasiado grande. El tamaño máximo es 3 MB.');
      if (ref.current) ref.current.value = '';
      return;
    }

    setFileName(file.name);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];

    if (!file) return;

    if (!isValidImage(file)) {
      alert('Archivo inválido. Solo se permiten imágenes (.jpg, .jpeg, .png)');
      return;
    }

    if (!isUnder3MB(file)) {
      alert('Archivo demasiado grande. El tamaño máximo es 3 MB.');
      return;
    }

    setFileName(file.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral2 opacity-40"
        onClick={onClose}
      />
      <div className="w-2xl h-auto bg-white rounded-xl p-6 relative z-50">
        <div className="w-full flex justify-end">
          <ButtonIcon
            icon={CloseIcon}
            onClick={onClose}
            variantColor="variant2"
          />
        </div>
        <h2 className="headline-sm text-primary text-center mb-4">
          Comprobante de Pago
        </h2>
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
                ? 'border-secondary2 bg-secondary2/25'
                : fileName
                  ? 'border-secondary2 bg-secondary2/5'
                  : 'border-neutral2 bg-transparent'
            }`}
          >
            <div className="flex flex-row items-center gap-5">
              <div>{fileName ? <IconFile /> : <IconNoFile />}</div>
              <div className="mr-2">
                <p className="subtitle-md text-onBack">
                  {fileName ? fileName : 'Ningún archivo seleccionado'}
                </p>
                <p className="body-md text-primary hover:text-secondary2 mt-1 underline transition">
                  Selecciona o arrastra el archivo aquí
                </p>
              </div>
            </div>
            <input
              ref={ref}
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="mb-4">{children}</div>
        <div className="flex flex-row justify-end space-x-4 mt-6 mb-2">
          <Button onClick={onClose} label="Cancelar" variantColor="variant2" />
          <Button onClick={onConfirm} label="Subir archivo" />
        </div>
      </div>
    </div>
  );
};
