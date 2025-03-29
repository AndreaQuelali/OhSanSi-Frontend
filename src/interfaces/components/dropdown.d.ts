import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

export interface DropdownOption {
  [key: string]: string | number; 
}

export interface DropdownProps<T extends FieldValues> {
  name: Path<T>; 
  label: string;
  options: DropdownOption[];
  placeholder?: string;
  displayKey: string; 
  valueKey: string; 
  register: UseFormRegister<T>; 
  errors?: FieldErrors<T>; 
  validationRules?: Record<string, unknown>;
  className?: string;
}