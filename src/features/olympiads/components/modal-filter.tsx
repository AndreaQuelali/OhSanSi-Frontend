import { Button, ButtonIcon } from '@/components';
import CloseIcon from '@/components/icons/close';
import React from 'react';

type FilterProps<T> = {
  label: string;
  options: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export const FilterModal = <T extends Record<string, any>>({
  label,
  options,
  valueKey,
  labelKey,
  selectedValues,
  onChange,
  onClose,
  onConfirm,
}: FilterProps<T>) => {
  const handleCheckboxChange = (value: string) => {
    const isSelected = selectedValues.includes(value);
    const updatedValues = isSelected
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(updatedValues);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral2 opacity-40"
        onClick={onClose}
      />
      <div className="w-96 h-auto bg-white rounded-xl p-6 relative z-50">
        <div className="w-full flex justify-end">
          <ButtonIcon
            icon={CloseIcon}
            onClick={onClose}
            variantColor="variant2"
          />
        </div>
        <h2 className="subtitle-md mb-4">{label}</h2>
        <div className="max-h-64 overflow-y-auto pr-2 space-y-3 body-md">
          {options.map((option) => {
            const value = option[valueKey] as string;
            const label = option[labelKey] as string;
            const isChecked = selectedValues.includes(value);

            return (
              <label
                key={value}
                className={`flex items-center gap-2 cursor-pointer ${
                  isChecked ? 'text-primary' : 'text-onBack'
                }`}
              >
                <input
                  type="checkbox"
                  value={value}
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(value)}
                  className="accent-indigo-900 w-4 h-4 border border-gray-400 rounded focus:ring-indigo-500"
                />
                {label}
              </label>
            );
          })}
        </div>
        <div className="flex flex-row justify-end space-x-4 mt-6 mb-2">
          <Button onClick={onClose} label="Cancelar" variantColor="variant2" />
          <Button onClick={onConfirm} label="Confirmar" />
        </div>
      </div>
    </div>
  );
};
