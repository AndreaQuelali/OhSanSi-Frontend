import { FieldErrors, UseFormRegister } from "react-hook-form";

export interface InputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "date";
  className?: string;
  register?: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  validationRules?: Record<string, unknown>;
}
