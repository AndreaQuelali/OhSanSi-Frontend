import { FieldValues } from 'react-hook-form';
import { InputProps } from '@/interfaces';

interface ExtendedInputProps<T extends FieldValues> extends InputProps<T> {
  readOnly?: boolean;
  disabled?: boolean;
  defaultValue?: string;
}

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
  readOnly = false,
  disabled = false,
  defaultValue = '',
}: ExtendedInputProps<T>) => {
  const isTextType = type === 'text';

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    target.value = target.value.toUpperCase();
    if (onInput) onInput(e);
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor={name as string}
        className={`subtitle-md ${labelPadding} ${disabled ? 'text-neutral2' : 'text-primary'}`}
      >
        {label} {isRequired && <span className="text-error">*</span>}
      </label>
      <div className="w-full">
        <input
          id={name as string}
          placeholder={placeholder}
          type={type}
          className={`h-[50px] body-lg placeholder-neutral border-b-[1px] rounded p-2 w-full
            ${disabled ? 'bg-surface text-neutral2 border-neutral cursor-not-allowed' : 'border-neutral'}
            ${className}
          `}
          defaultValue={defaultValue}
          readOnly={readOnly}
          disabled={disabled}
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
