import { FieldValues } from 'react-hook-form';
import { InputProps } from '@/interfaces';

export const InputText = <T extends FieldValues>({
  label,
  name,
  placeholder = '',
  type = 'text',
  className = '',
  labelPadding = 'py-1',
  register,
  errors,
  validationRules = {},
  isRequired = true,
  onInput,
}: InputProps<T>) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name as string}
        className={`text-primary subtitle-md ${labelPadding}`}
      >
        {label} {isRequired && <span className="text-error">*</span>}
      </label>
      <div className="w-full">
        <input
          id={name as string}
          placeholder={placeholder}
          type={type}
          className={`h-[50px] body-lg placeholder-neutral border-b-[1px] border-neutral rounded p-2 ${className}`}
          {...(register ? register(name, validationRules) : {})}
          onInput={onInput}
        />
      </div>
      <div className="min-h-[25px]">
        {errors &&
          name
            .split('.')
            .reduce(
              (acc: Record<string, any>, key: string) => acc?.[key],
              errors,
            ) && (
            <span className="text-error subtitle-sm text-wrap text-center">
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
