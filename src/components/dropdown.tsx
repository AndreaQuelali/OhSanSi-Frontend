import React from 'react';
import { DropdownProps } from '../interfaces/dropdown';

export const Dropdown: React.FC<DropdownProps> = ({
  name,
  label,
  options = [],
  value,
  onChange,
  placeholder = '',
  valueKey,
  errors = {},
}) => {
  return (
    <div className="flex flex-col mx-2">
      {label && (
        <label
          htmlFor={name}
          className="mt-[20px] py-1 text-primary font-roboto"
        >
          {label} <span className="text-error-err2">*</span>
        </label>
      )}
      <select
        id={name}
        name={name}
        className="w-full md:w-[340px] h-[50px] bg-transparent border-[1px] rounded border-neutral2 font-body placeholder-neutral2 text-onBack  p-2"
        value={value}
        onChange={onChange}
      >
        <option value="" disabled className="bg-neutral2 text-white">
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option
            key={index}
            value={option[valueKey]}
            className="bg-neutral2 text-onBack"
          ></option>
        ))}
      </select>
      {errors?.[name] && (
        <span className="text-error">{errors[name]?.message as string}</span>
      )}
    </div>
  );
};
