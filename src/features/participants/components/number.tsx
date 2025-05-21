
export const NumberCircle = ({ number, active }: NumberCircleProps) => {
  return (
    <div
      className={`w-6 h-6 subtitle-sm flex items-center justify-center rounded-full mx-2 ${
        active ? 'bg-primary' : 'bg-neutral2'
      } text-white font-bold`}
    >
      {number}
    </div>
  );
};
