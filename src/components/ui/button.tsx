import { ButtonProps } from '@/interfaces';

export const Button = ({
  type = 'button',
  label,
  variantColor = 'variant1',
  onClick,
  disabled = false,
  icon: Icon,
  className = '',
}: ButtonProps) => {
  const baseButton =
    'button-lg rounded-[20px] h-10 pl-4 pr-5  text-center flex items-center whitespace-nowrap';

  const varCol: Record<string, string> = {
    variant1: 'text-white bg-primary hover:bg-secondary2 cursor-pointer',
    variant2:
      'text-primary bg-white border-[1px] border-primary hover:bg-secondary2 cursor-pointer',
    variant3: 'text-primary hover:bg-primary hover:text-white cursor-pointer',
    variant4: 'text-primary hover:text-secondary2 cursor-pointer',
    variant5: 'text-primary opacity-40',
    variantDesactivate: 'bg-primary text-white opacity-40',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseButton} ${varCol[variantColor]} ${className} flex items-center justify-center`}
    >
      {Icon && <Icon className="mr-0" />}
      <p className="pl-1 text-center text-wrap">{label}</p>
    </button>
  );
};
