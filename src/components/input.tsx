import { InputProps } from '../interfaces/components/input';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

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
}: InputProps<T>) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name as string} className={`text-primary subtitle-md ${labelPadding}`}>
        {label} <span className="text-error">*</span>
      </label>
      <div className="w-full">
        <input
          id={name as string}
          placeholder={placeholder}
          type={type}
          className={`h-[50px] body-lg placeholder-neutral border-b-[1px] border-neutral rounded p-2 ${className}`}
          {...register(name, validationRules)}
        />
      </div>
      <div className='h-[25px]'>
        {errors?.[name] && (
          <span className="text-error subtitle-sm text-wrap text-center">
            {String(errors[name]?.message)}
          </span>
        )}
      </div>
    </div>
  );
};