
interface CardAreaProps {
  label: string;
  imageUrl: string;
  selected?: boolean;
  onClick: () => void;
}

export const CardArea = ({ label, imageUrl, selected = false, onClick }: CardAreaProps) => {
  return (
    <div className="w-56 flex flex-col items-center cursor-pointer" onClick={onClick}>
      <div className={`w-56 h-32 rounded-t-2xl border ${selected ? "border-primary" : "border-neutral"}`}>
        <img src={imageUrl} alt={label} className="w-full h-full object-cover rounded-t-2xl" />
      </div>
      <div
        className={`flex items-center justify-center rounded-b-2xl w-52 h-7 subtitle-sm transition-all 
          ${selected ? "bg-primary text-white" : "bg-surface text-onBack hover:bg-primary hover:text-white"}`}
      >
        <p>{label}</p>
      </div>
    </div>
  );
};
