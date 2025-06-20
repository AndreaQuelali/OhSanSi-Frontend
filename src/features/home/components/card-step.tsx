import { ReactNode } from 'react';
import { useNavigate } from 'react-router';

interface CardPasoProps {
  Icon: ReactNode;
  text: string;
  route: string;
}

export const CardPaso = ({ Icon, text, route }: CardPasoProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center text-center cursor-pointer hover:scale-95 transition-transform duration-200 w-32 md:w-36"
      onClick={() => navigate(route)}
    >
      <div className="w-16 h-16 md:w-20 md:h-20 mb-8">{Icon}</div>
      <p className="font-roboto text-sm md:text-base">{text}</p>
    </div>
  );
};
