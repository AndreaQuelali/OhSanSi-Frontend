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
    variant1: 'text-white bg-primary hover:bg-secondary2',
    variant2: 'text-primary  hover:bg-primary hover:text-white',
    variant3: '',
    variantDesactivate: 'bg-neutral2',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseButton} ${varCol[variantColor]} flex items-center justify-center`}
    >
      {Icon && <Icon />}
    </button>
  );
};
