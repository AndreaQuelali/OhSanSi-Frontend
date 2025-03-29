import CloseIcon from '@/components/icons/close';
import UploadImageIcon from '@/components/icons/upload-image';
import React, { useState, useRef } from 'react';

const CardUploadImage = () => {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative w-full h-[120px] border border-neutral rounded-lg flex items-center justify-center">
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
  );
};

export default CardUploadImage;
