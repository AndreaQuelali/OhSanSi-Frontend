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
      className="flex flex-col items-center text-center cursor-pointer hover:scale-95 transition-transform duration-200 w-40"
      onClick={() => navigate(route)}
    >
      <div className="w-20 h-20 mb-4 flex ">{Icon}</div>
      <p className="font-roboto text-base">{text}</p>
    </div>
  );
};
