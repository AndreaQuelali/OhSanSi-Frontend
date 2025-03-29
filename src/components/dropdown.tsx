import { DropdownProps } from "../interfaces";
import { FieldValues } from "react-hook-form";

export const Dropdown = <T extends FieldValues>({
  name,
  label,
  options = [],
  placeholder = "Selecciona una opción",
  displayKey,
  valueKey,
  register,
  errors = {},
  validationRules = {},
  className = "",
}: DropdownProps<T>) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="py-1 text-primary subtitle-md">
          {label} <span className="text-error">*</span>
        </label>
      )}
      <select
        id={name}
        className={`h-[50px] bg-transparent rounded border-b-[1px] border-neutral font-body placeholder-neutral text-onBack p-2 ${className} ${
          errors[name] ? "border-error" : ""
        }`} 
        {...register(name, validationRules)} 
      >
        <option value="" disabled className="bg-neutral2 text-white">
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option[valueKey]} className="bg-neutral2 text-onBack">
            {option[displayKey]} 
          </option>
        ))}
      </select>
      <div className='h-[25px]'>
        {errors?.[name] && (
          <span className="text-error subtitle-sm">{String(errors[name]?.message)}</span> 
        )}
      </div>
    </div>
  );
};
