import { DropdownProps } from "../interfaces";

export const Dropdown = ({
  name,
  label,
  options = [],
  value,
  placeholder = "",
  valueKey = "id",
  displayKey = "name",
  errors = {},
  className = "",
  register,
  ...rest
}: DropdownProps) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="py-1 text-primary subtitle-md">
          {label} <span className="text-error">*</span>
        </label>
      )}
      <select
        id={name}
        className={`h-[50px] bg-transparent rounded border-b-[1px] border-neutral font-body placeholder-neutral text-onBack p-2 ${className}`}
        {...rest}
        {...(register ? register(name) : {})} 
      >
        <option value="" disabled className="bg-neutral2 text-white">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option[valueKey]} value={option[valueKey]} className="bg-neutral2 text-onBack">
            {option[displayKey]} 
          </option>
        ))}
      </select>
      <div className="min-h-[30px]">
        {errors?.[name] && (
          <span className="text-error subtitle-sm">{errors[name]?.message as string}</span>
        )}
      </div>
    </div>
  );
};
