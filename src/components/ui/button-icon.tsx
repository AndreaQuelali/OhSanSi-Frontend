import { ButtonIconProps } from '@/interfaces/components/button-icon';

export const ButtonIcon = ({
  type = 'button',
  variantColor = 'variant1',
  onClick,
  disabled = false,
  icon: Icon,
}: ButtonIconProps) => {
  const baseButton =
    'button-lg rounded-[20px] h-10 w-10 text-center flex items-center whitespace-nowrap';

  const varCol: Record<string, string> = {
    variant1: 'text-white bg-primary hover:bg-secondary2 transition',
    variant2: 'text-primary hover:bg-primary hover:text-white transition',
    variant3: 'text-primary hover:text-secondary2',
    variantDesactivate: 'text-neutral2',
  };

  const cursorClass = disabled ? 'cursor-default' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseButton} ${cursorClass} ${varCol[variantColor]} flex items-center justify-center`}
    >
      {Icon && <Icon />}
    </button>
  );
};
