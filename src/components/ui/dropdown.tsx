import { DropdownProps } from '@/interfaces';

export const Dropdown = ({
  name,
  label,
  options = [],
  value,
  onChange,
  placeholder = '',
  valueKey,
  errors = {},
  className = '',
}: DropdownProps) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className=" py-1 text-primary subtitle-md ">
          {label} <span className="text-error">*</span>
        </label>
      )}
      <select
        id={name}
        name={name}
        className={`h-[50px] bg-transparent outline-none rounded border-b-[1px] border-neutral font-body placeholder-neutral text-onBack p-2 ${className}`}
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
