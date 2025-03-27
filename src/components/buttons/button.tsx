import { ButtonProps } from '../../interfaces/button';

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  label,
  variantColor = 'variant1',
  onClick,
  disabled = false,
}) => {
  const baseButton =
    'font-roboto rounded-[20px] h-10 pl-4 pr-5  text-center flex items-center whitespace-nowrap';

  const varCol: Record<string, string> = {
    variant1: 'text-white bg-primary hover:bg-secondary2',
    variant2: 'text-primary bg-white border-primary',
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
      <p className="pl-2 text-center text-wrap">{label}</p>
    </button>
  );
};
