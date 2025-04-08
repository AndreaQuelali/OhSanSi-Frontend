import { RadioGroupProps } from '@/interfaces';
import { FieldValues } from 'react-hook-form';

export const RadioGroup = <T extends FieldValues>({
  register,
  name,
  label,
  options,
  direction = 'col',
  className = '',
  labelPadding = 'py-1',
  errors,
  validationRules = {},
  isRequired = true,
}: RadioGroupProps<T>) => {
  const fieldError = name
    .toString()
    .split('.')
    .reduce((acc: any, key: string) => acc?.[key], errors);

  return (
    <div className="flex flex-col">
      <label className={`text-primary subtitle-md py-3 ${labelPadding}`}>
        {label} {isRequired && <span className="text-error">*</span>}
      </label>

      <div className={`flex flex-${direction} gap-4 ${className}`}>
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value={option.value}
              {...(register ? register(name, validationRules) : {})}
              className="form-radio h-4 w-4 text-primary focus:ring-primary cursor-pointer"
            />
            <span className="body-lg text-neutral">{option.label}</span>
          </label>
        ))}
      </div>

      <div className="min-h-[25px]">
        {fieldError && (
          <span className="text-error subtitle-sm text-wrap text-center">
            {String(fieldError.message)}
          </span>
        )}
      </div>
    </div>
  );
};
