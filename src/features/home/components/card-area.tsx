import {
  Tag,
  Calculator,
  Microscope,
  Atom,
  Brain,
  FlaskConical,
  Telescope,
  Cpu,
} from 'lucide-react';

interface CardAreaProps {
  areaName: string;
}

// Mapa de íconos según área
const iconMap: Record<string, React.ReactNode> = {
  MATEMÁTICAS: <Calculator className="w-5 h-5 text-primary" />,
  BIOLOGÍA: <Microscope className="w-5 h-5 text-primary" />,
  'ASTRONOMÍA - ASTROFÍSICA': <Telescope className="w-5 h-5 text-primary" />,
  ROBÓTICA: <Cpu className="w-5 h-5 text-primary" />,
  INFORMÁTICA: <Brain className="w-5 h-5 text-primary" />,
  QUÍMICA: <FlaskConical className="w-5 h-5 text-primary" />,
  FÍSICA: <Atom className="w-5 h-5 text-primary" />,
  default: <Tag className="w-5 h-5 text-primary" />,
};

export const CardArea = ({ areaName }: CardAreaProps) => {
  const icon = iconMap[areaName.toUpperCase()] || iconMap['default'];

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 w-full sm:w-64 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.08)] hover:border-primary/10 hover:scale-[1.01] transition-all duration-200 ease-in-out">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="subtitle-md text-onBack truncate">{areaName}</h3>
      </div>
    </div>
  );
};
