import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  className?: string;
  labelPadding?: string;
  register?: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  validationRules?: Record<string, unknown>;
  isRequired?: boolean;
}