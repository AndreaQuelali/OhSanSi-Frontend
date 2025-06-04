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
  disablePlaceholder = true,
}: DropdownProps<T> & { disabled?: boolean }) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className={`py-1 subtitle-md ${disabled ? 'text-neutral2' : 'text-primary'}`}>
          {label} {isRequired && <span className="text-error">*</span>}
        </label>
      )}
      <select
        id={name}
        value={value}
        className={`h-[50px] rounded border-b-[1px] font-body p-2
          ${disabled ? 'bg-surface text-neutral2 border-neutral cursor-not-allowed' : 'bg-transparent border-neutral text-onBack'}
          ${errors[name] ? 'border-error' : ''}
          ${value === '' ? 'text-neutral' : ''}
          ${className}
        `}
        {...register(name, validationRules)}
        disabled={disabled}
      >
        <option
          value=""
          disabled={disablePlaceholder}
          className="bg-neutral2 text-white"
        >
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
          .reduce(
            (acc: Record<string, any>, key: string) => acc?.[key],
            errors,
          ) && (
          <span className="text-error subtitle-sm">
            {String(
              name
                .split('.')
                .reduce(
                  (acc: Record<string, any>, key: string) => acc?.[key],
                  errors,
                )?.message,
            )}
          </span>
        )}
      </div>
    </div>
  );
};
