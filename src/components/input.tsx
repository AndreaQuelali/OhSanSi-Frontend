import { InputProps } from '../interfaces/components/input';

export const InputText = ({
  label,
  name,
  placeholder = '',
  type = 'text',
  className='',
  labelPadding = 'py-1',
  register,
  errors = {},
  onChange,
  value,
  validationRules = {},
}: InputProps) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className={`text-primary subtitle-md ${labelPadding} ${errors[name] ? 'text-error' : ''}`}
      >
        {label} <span className="text-error">*</span>
      </label>
      <div className="w-full">
      <input
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
          value={value}
          className={`body-lg placeholder-neutral border-neutral border-b-[1px] rounded p-2 ${className}`} 
        />
      </div>
      <div className={`${errors[name] ? 'h-3 mb-2' : 'h-0'}`}>
        {errors[name] && (
          <span className="text-error text-wrap text-center">
            {errors[name]?.message as string}
          </span>
        )}
      </div>
    </div>
  );
};
