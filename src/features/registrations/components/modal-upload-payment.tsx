import { Button, ButtonIcon } from '@/components';
import CloseIcon from '@/components/icons/close';
import IconFile from '@/components/icons/icon-file';
import IconNoFile from '@/components/icons/icon-no-file';
import { API_URL } from '@/config/api-config';
import axios from 'axios';
import { useRef, useState } from 'react';

export const ModalUploadPay = ({ onClose }: ModalProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const [enhancedPreview, setEnhancedPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidImage = (file: File) =>
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg';

  const isUnder5MB = (file: File) => file.size <= 5 * 1024 * 1024;

  const hasMinimumResolution = (
    file: File,
    callback: (valid: boolean, url: string) => void,
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        if (img.width >= 300 && img.height >= 300) {
          callback(true, url);
        } else {
          callback(false, url);
        }
      };
      img.onerror = () => callback(false, url);
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const processFile = async (file: File) => {
    if (!isValidImage(file)) {
      alert('Archivo inválido. Solo se permiten imágenes (.jpg, .jpeg, .png)');
      if (ref.current) ref.current.value = '';
      return;
    }

    if (!isUnder5MB(file)) {
      alert('Archivo demasiado grande. El tamaño máximo es 5 MB.');
      if (ref.current) ref.current.value = '';
      return;
    }

    hasMinimumResolution(file, async (valid, url) => {
      if (!valid) {
        alert('La imagen debe tener al menos 300x300 píxeles.');
        if (ref.current) ref.current.value = '';
        return;
      }

      try {
        const enhancedFile = await enhanceImageQuality(file);
        const enhancedUrl = URL.createObjectURL(enhancedFile);

        setFileName(file.name);
        setImagePreview(url); // original
        setEnhancedPreview(enhancedUrl); // optimizada
      } catch (error) {
        console.error('Error al mejorar la imagen:', error);
        alert('Ocurrió un error al procesar la imagen.');
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const enhanceImageQuality = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          // Redimensionar manteniendo proporción
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const aspectRatio = width / height;
            if (aspectRatio > 1) {
              width = MAX_WIDTH;
              height = MAX_WIDTH / aspectRatio;
            } else {
              height = MAX_HEIGHT;
              width = MAX_HEIGHT * aspectRatio;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('No se pudo obtener el contexto del canvas');

          ctx.drawImage(img, 0, 0, width, height);

          // 🔍 APLICAR FILTRO DE NITIDEZ (convolución 3x3)
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          const copy = new Uint8ClampedArray(data); // para no modificar original en tiempo real

          const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

          const applyKernel = (x: number, y: number, c: number) => {
            const idx = (y * width + x) * 4;
            let sum = 0;
            let i = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const px = x + kx;
                const py = y + ky;
                if (px >= 0 && px < width && py >= 0 && py < height) {
                  const pixelIdx = (py * width + px) * 4 + c;
                  sum += copy[pixelIdx] * kernel[i];
                }
                i++;
              }
            }
            return Math.min(255, Math.max(0, sum));
          };

          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              for (let c = 0; c < 3; c++) {
                const idx = (y * width + x) * 4 + c;
                data[idx] = applyKernel(x, y, c);
              }
            }
          }

          ctx.putImageData(imageData, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject('No se pudo generar la imagen mejorada');
            },
            'image/jpeg',
            0.92,
          );
        };
        img.onerror = () => reject('No se pudo cargar la imagen');
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject('Error al leer el archivo');
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitImage = async () => {
    if (!enhancedPreview) {
      alert('No hay imagen para subir');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(enhancedPreview);
      const imageBlob = await response.blob();
      const formData = new FormData();
      formData.append('boleta', imageBlob, fileName || 'comprobante.jpg');

      const uploadResponse = await axios.post(
        `${API_URL}/prueba-ocr`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (uploadResponse.status !== 200) {
        throw new Error('Error al subir la imagen');
      }

      console.log('Envio!', uploadResponse.data);

      alert('Imagen subida con éxito');
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      alert('Ocurrió un error al procesar la imagen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral2 opacity-40"
        onClick={onClose}
      />
      <div className="w-2xl h-auto bg-white rounded-xl p-6 relative z-50 max-w-xl">
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
                : imagePreview
                  ? 'border-secondary2 bg-secondary2/5 hover:border-primary hover:bg-primary2/5'
                  : 'border-neutral2 bg-transparent hover:border-primary'
            }`}
          >
            {imagePreview && enhancedPreview ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 w-full">
                <div className="flex flex-col items-center">
                  <p className="body-sm mb-1">Original</p>
                  <img
                    src={imagePreview}
                    alt="Original"
                    className="w-full max-h-64 object-contain rounded-md border border-neutral2"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <p className="body-sm mb-1">Mejorada</p>
                  <img
                    src={enhancedPreview}
                    alt="Mejorada"
                    className="w-full max-h-64 object-contain rounded-md border border-green-400"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-row items-center gap-5">
                <div>{fileName ? <IconFile /> : <IconNoFile />}</div>
                <div className="mr-2 text-center">
                  <p className="subtitle-md text-onBack">
                    {fileName || 'Ningún archivo seleccionado'}
                  </p>
                  <p className="body-md text-primary hover:text-secondary2 mt-1 underline transition">
                    Selecciona o arrastra el archivo aquí
                  </p>
                </div>
              </div>
            )}

            <input
              ref={ref}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="flex flex-row justify-end space-x-4 mt-6 mb-2">
          <Button onClick={onClose} label="Cancelar" variantColor="variant2" />
          <Button
            onClick={handleSubmitImage}
            label="Subir archivo"
            disabled={!enhancedPreview || isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};
