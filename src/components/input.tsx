import { InputProps } from "../interfaces/components/input";
import { FieldValues } from "react-hook-form";

export const InputText = <T extends FieldValues>({
  label,
  name,
  placeholder = "",
  type = "text",
  className = "",
  register,
  errors = {},
  validationRules = {},
}: InputProps<T>) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={String(name)}
        className={`py-1 text-primary subtitle-md ${errors[name] ? "text-error" : ""}`}
      >
        {label} <span className="text-error">*</span>
      </label>
      <div className="relative w-full">
        <input
          id={String(name)}
          placeholder={placeholder}
          type={type}
          className={`h-[50px] body-lg placeholder-neutral border-b-[1px] rounded p-2 ${className}`}
          {...(register ? register(name, validationRules) : {})}
        />
      </div>
      <div className={`min-h-[30px]`}>
        {errors[name] && (
          <span className="text-error subtitle-sm text-wrap text-center">
            {errors[name]?.message as string}
          </span>
        )}
      </div>
    </div>
  );
};
