import { Button, InputText } from '../../../components';
import { useState, useRef } from 'react';
import CardUploadImage from './card-upload-image';
import IconDelete from '@/assets/icons/icon-delete';

interface Area {
  id: string;
  name: string;
}

const FormAreas: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [error, setError] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const imageUploaderRef = useRef<{ resetImage: () => void } | null>(null);

  const isValidArea = (value: string): boolean =>
    /^[a-zA-ZñÑ-\s]+$/.test(value.trim());

  const handleAddArea = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setError('Este campo no puede estar vacío');
      return;
    }
    if (!isValidArea(trimmedValue)) {
      setError(
        "Solo se permiten caracteres alfabéticos, la letra 'ñ' y el guion '-'",
      );
      return;
    }
    if (areas.some((area) => area.name === trimmedValue)) {
      setError('El área ya está registrada en Áreas agregadas');
      return;
    }
    if (!selectedImage) {
      setImageError('Debe subir una imagen antes de agregar el área.');
      return;
    }

    setAreas([
      ...areas,
      { id: crypto.randomUUID(), name: trimmedValue }, // Genera un ID único
    ]);
    setInputValue('');
    setError('');
    setImageError('');
    setSelectedImage(null);

    // Resetear la imagen después de agregar
    if (imageUploaderRef.current) {
      imageUploaderRef.current.resetImage();
    }
  };

  const handleRemoveArea = (areaId: string): void => {
    setAreas(areas.filter((area) => area.id !== areaId));
  };

  const handleImageUpload = (file: File | null): void => {
    if (!file) {
      setSelectedImage(null);
      return;
    }

    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedImageTypes.includes(file.type)) {
      setImageError('Solo se permiten imágenes en formato JPG, JPEG o PNG.');
      setSelectedImage(null);
    } else {
      setImageError('');
      setSelectedImage(file);
    }
  };

  return (
    <div className="my-16 mx-64">
      <form>
        <div className="flex flex-col">
          <h1 className="text-center headline-lg text-primary">
            Registro de Áreas de Competencia de Olimpiada
          </h1>
          <h1 className="text-center headline-md text-primary">Gestión 2025</h1>
          <div className="flex flex-row justify-between my-7">
            <div>
              <InputText
                label="Nombre del Área"
                name="inputArea"
                placeholder="Ingrese nombre del área"
                type="text"
                className="w-[540px]"
                labelPadding="py-5"
                register={() => {}}
                errors={{}}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setInputValue(e.target.value);
                  setError('');
                }}
                value={inputValue}
                validationRules={{}}
              />
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="w-[400px] flex flex-col">
              <CardUploadImage
                ref={imageUploaderRef}
                onChange={handleImageUpload}
              />
              {imageError && <p className="text-red-500 mt-2">{imageError}</p>}
            </div>
          </div>
          <Button label="Agregar" onClick={handleAddArea} />
          <h1 className="subtitle-md text-primary my-5">Áreas agregadas</h1>
          <ul>
            {areas.map((area) => (
              <li
                key={area.id}
                className="flex justify-between items-center border p-2 my-1"
              >
                {area.name}
                <button
                  onClick={() => handleRemoveArea(area.id)}
                  className="text-red-500"
                >
                  <IconDelete classname="w-6 h-6" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-row justify-end space-x-5">
            <Button label="Cancelar" variantColor="variant2" />
            <Button
              label="Registrar"
              disabled={areas.length === 0 || !!imageError}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormAreas;
