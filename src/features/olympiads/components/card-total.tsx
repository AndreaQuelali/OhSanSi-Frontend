import React from 'react';
import { Users } from 'lucide-react';

interface CardTotalProps {
  title: string;
  value: number;
  subtitle: string;
}

const CardTotal: React.FC<CardTotalProps> = ({ title, value, subtitle }) => {
  return (
    <div className="border-2 border-primary text-onBack rounded-xl px-6 py-4 w-full max-w-[220px] text-left shadow-sm">
      <h4 className="text-sm font-semibold text-primary">{title}</h4>
      <div className="flex mt-2 mb-1 space-x-1">
        <span className="headline-sm ">{value}</span>
      </div>
      <p className="text-xs text-neutral">{subtitle}</p>
    </div>
  );
};

export default CardTotal;
