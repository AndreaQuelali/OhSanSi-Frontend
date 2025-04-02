interface CardAreaProps {
  label: string;
  imageUrl: string;
  selected?: boolean;
  onClick: () => void;
}

export const CardArea = ({
  label,
  imageUrl,
  selected = false,
  onClick,
}: CardAreaProps) => {
  return (
    <div
      className="w-56 flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`w-56 h-32 rounded-2xl border ${selected ? 'border-primary' : ''}`}
      >
        <img
          src={imageUrl}
          alt={label}
          className="w-full h-full object-cover rounded-t-2xl"
        />
      </div>
      <div
        className={`flex items-center justify-center w-52 h-7 subtitle-sm 
          ${selected ? ' text-primary' : ' text-onBack hover:text-primary'}`}
      >
        <p>{label}</p>
      </div>
    </div>
  );
};
