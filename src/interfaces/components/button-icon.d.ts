export interface ButtonIconProps {
  icon?: React.ElementType;
  variantColor?:
    | 'variant1'
    | 'variant2'
    | 'variant3'
    | 'variant4'
    | 'variantDesactivate';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}
