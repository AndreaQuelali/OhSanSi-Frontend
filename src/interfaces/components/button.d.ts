export interface ButtonProps {
  label: string;
  icon?: React.ElementType; // Ensure icon is a valid React component
  variantColor?: 'variant1' | 'variant2' | 'variant3' | 'variantDesactivate';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}
