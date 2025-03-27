import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

export interface InputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  className?: string;
  register?: UseFormRegister<FieldValues>;
  errors?: FieldErrors;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  validationRules?: Record<string, unknown>;
}
