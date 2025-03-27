import { InputProps } from '../interfaces/components/input';

export const InputText = ({
  label,
  name,
  placeholder = '',
  type = 'text',
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
        className={`py-1 text-primary subtitle-md ${errors[name] ? 'text-error' : ''}`}
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
          className="body-lg placeholder-neutral  border-b-[1px] rounded p-2"
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
