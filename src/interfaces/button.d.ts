import { ReactElement } from 'react';

export interface ButtonProps {
  label: string;
  icon?: ReactElement | null;
  variantColor?: 'variant1' | 'variant2' | 'variant3' | 'variantDesactivate';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}
