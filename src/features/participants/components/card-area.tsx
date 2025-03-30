import React from 'react';

export const CardArea = ({ label, imageUrl }: CardAreaProps) => {
  return (
    <div className="w-56 flex flex-col items-center">
      <div className="w-56 h-32 rounded-t-2xl">
        <img src={imageUrl} alt={label} />
      </div>
      <div className="flex items-center justify-center rounded-b-2xl bg-surface w-52 h-7 text-onBack hover:text-white hover:bg-primary">
        <p className="subtitle-sm ">{label}</p>
      </div>
    </div>
  );
};
