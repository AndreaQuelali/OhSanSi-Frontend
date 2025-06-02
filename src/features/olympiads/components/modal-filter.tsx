import { Button, ButtonIcon } from '@/components';
import CloseIcon from '@/components/icons/close';
import { SearchInput } from '@/components/ui/search';
import { useEffect, useMemo, useState } from 'react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentValues, setCurrentValues] = useState<string[]>(selectedValues);

  useEffect(() => {
    setCurrentValues([...selectedValues]);
  }, [selectedValues]);

  const hasChanges = useMemo(() => {
    if (currentValues.length !== selectedValues.length) return true;

    const currentSet = new Set(currentValues);
    return selectedValues.some((val) => !currentSet.has(val));
  }, [currentValues, selectedValues]);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const seen = new Set();
    return options.filter((option) => {
      const label = String(option[labelKey]).toLowerCase();
      const value = String(option[valueKey]);
      const match = label.includes(term);
      const isUnique = !seen.has(value);
      if (match && isUnique) {
        seen.add(value);
        return true;
      }
      return false;
    });
  }, [options, labelKey, valueKey, searchTerm]);

  const handleCheckboxChange = (value: string) => {
    const isSelected = currentValues.includes(value);
    const updatedValues = isSelected
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setCurrentValues(updatedValues);
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
        <h2 className="subtitle-md mb-4 text-primary">{label}</h2>
        {options.length > 15 && (
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        )}
        <div className="max-h-64 overflow-y-auto pr-2 space-y-3 body-md">
          {filteredOptions.map((option) => {
            const value = option[valueKey] as string;
            const label = option[labelKey] as string;
            const isChecked = currentValues.includes(value);

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
                  className="accent-primary w-4 h-4 border border-gray-400 rounded focus:ring-indigo-500"
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
