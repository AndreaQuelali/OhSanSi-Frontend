<<<<<<< HEAD
import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import CloseIcon from "../../../assets/icons/close";
import UploadImageIcon from "../../../assets/icons/uploadImage";
=======
import CloseIcon from '@/components/icons/close';
import UploadImageIcon from '@/components/icons/upload-image';
import React, { useState, useRef } from 'react';
>>>>>>> b917f94eb96c6057d929b865da4a8820cafde7b9

interface CardUploadImageProps {
  onChange?: (file: File | null) => void;
}

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];

const CardUploadImage = forwardRef(({ onChange }: CardUploadImageProps, ref) => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    resetImage: () => {
      setImage(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  }));

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (!allowedImageTypes.includes(file.type)) {
        setError("Solo se permiten imágenes en formato JPG, JPEG o PNG.");
        setImage(null);
        if (onChange) onChange(null);
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (onChange) {
        onChange(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setError(null);
    if (fileInputRef.current) {
<<<<<<< HEAD
      fileInputRef.current.value = "";
    }
    if (onChange) {
      onChange(null);
=======
      fileInputRef.current.value = '';
>>>>>>> b917f94eb96c6057d929b865da4a8820cafde7b9
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full h-[120px] border border-neutral rounded-lg flex flex-col items-center justify-center">
        {image ? (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <img src={image} alt="Preview" className="max-h-full rounded-lg" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-[-10px] right-[-10px] bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center cursor-pointer p-4"
            onClick={() => fileInputRef.current?.click()}
          >
<<<<<<< HEAD
            <UploadImageIcon />
            <p className="text-neutral-400 subtitle-md mt-2">Subir imagen</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      {error && <p className="text-error mt-2 subtitle-sm text-center">{error}</p>}
=======
            <CloseIcon />
          </button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center cursor-pointer p-4"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadImageIcon />
          <p className="text-neutral-400 subtitle-md mt-2">Subir imagen</p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
      />
>>>>>>> b917f94eb96c6057d929b865da4a8820cafde7b9
    </div>
  );
});

export default CardUploadImage;
