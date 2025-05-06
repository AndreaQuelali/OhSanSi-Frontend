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
  const isTextType = type === 'text';

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    target.value = target.value.toUpperCase();
    if (onInput) onInput(e); // Ejecuta el onInput externo si existe
  };

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
          onInput={isTextType ? handleInput : onInput}
        />
      </div>
      <div className="min-h-[25px]">
        {errors &&
          name
            .split('.')
            .reduce(
              (acc: Record<string, unknown>, key: string) =>
                acc && typeof acc === 'object'
                  ? (acc as Record<string, unknown>)[key]
                  : undefined,
              errors,
            ) && (
            <span className="text-error subtitle-sm text-wrap text-center">
              {String(
                name
                  .split('.')
                  .reduce(
                    (acc: Record<string, unknown>, key: string) =>
                      acc && typeof acc === 'object'
                        ? (acc as Record<string, unknown>)[key]
                        : undefined,
                    errors,
                  )?.message,
              )}
            </span>
          )}
      </div>
    </div>
  );
};
