import { ChangeEvent } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

export interface DropdownOption {
  [key: string]: string | number;
}

export interface DropdownProps {
  name: string;
  label: string;
  options: DropdownOption[];
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  displayKey: string;
  valueKey: string;
  register?: UseFormRegister<FieldValues>;
  errors?: FieldErrors;
}
