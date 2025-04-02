import { FieldValues } from 'react-hook-form';

import { DropdownProps } from '@/interfaces';

export const Dropdown = <T extends FieldValues>({
  name,
  label,
  options = [],
  placeholder = 'Selecciona una opción',
  displayKey,
  valueKey,
  register,
  errors = {},
  validationRules = {},
  className = '',
  isRequired = true,
  disabled = false,
  value,
}: DropdownProps<T> & { disabled?: boolean }) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="py-1 text-primary subtitle-md">
          {label} {isRequired && <span className="text-error">*</span>}
        </label>
      )}
      <select
        id={name}
        value={value}
        className={`h-[50px] bg-transparent rounded border-b-[1px] border-neutral font-body placeholder-neutral text-onBack p-2 ${className} ${
          errors[name] ? "border-error" : ""
        }`} 
        {...register(name, validationRules)}
        disabled={disabled} 
      >
        <option value="" disabled className="bg-neutral2 text-white">
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option
            key={index}
            value={option[valueKey]}
            className="bg-neutral2 text-onBack"
          >
            {option[displayKey]}
          </option>
        ))}
      </select>
      <div className="h-[25px]">
        {name
          .split('.')
          .reduce((acc: Record<string, any>, key: string) => acc?.[key], errors) && (
          <span className="text-error subtitle-sm">
            {String(
              name
                .split('.')
                .reduce((acc: Record<string, any>, key: string) => acc?.[key], errors)
                ?.message
            )}
          </span>
        )}
      </div>
    </div>
  );
};
