import { InputProps } from '../interfaces/components/input';

export const InputText = ({
  label,
  name,
  placeholder = '',
  type = 'text',
  className = '',
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
        className={`py-1 text-onBack ${errors[name] ? 'text-error' : ''}`}
      >
        {label} <span className="text-error">*</span>
      </label>
      <div className="relative w-full">
        <input
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
          value={value}
          className={`${className} ${errors[name] ? '' : ''}`}
          {...(register ? register(name, validationRules) : {})}
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
