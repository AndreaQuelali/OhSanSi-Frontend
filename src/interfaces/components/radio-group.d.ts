import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: RadioOption[];
  direction?: 'row' | 'col';
  className?: string;
  labelPadding?: string;
  register?: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  validationRules?: Record<string, any>;
  isRequired?: boolean;
}
