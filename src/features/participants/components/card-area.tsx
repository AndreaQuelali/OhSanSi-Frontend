interface Nivel {
  id_nivel: number;
  nombre_nivel: string;
}

interface AreaCardProps {
  area: string;
  niveles: Nivel[];
  onClick: () => void;
  nivelesSeleccionados: Nivel[];
}

export default function CardArea({
  area,
  onClick,
  nivelesSeleccionados,
}: AreaCardProps) {
  const isSelected = nivelesSeleccionados.length > 0;

  return (
    <div
      className={`relative flex flex-col justify-center items-center rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 shadow-lg border ${
        isSelected
          ? 'bg-primary text-white border-primary'
          : 'bg-gray-100 border-gray-300'
      }`}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute top-0 left-0 w-full h-full bg-primary flex flex-col items-center justify-center z-10">
          <p className="text-white subtitle-md font-semibold">Área Seleccionada</p>
          <div className="flex flex-wrap justify-center mt-2">
            {nivelesSeleccionados.map((nivel) => (
              <span key={nivel.id_nivel} className="text-sm text-gray-200 mx-1">
                {nivel.nombre_nivel}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center p-6 bg-surface rounded-lg w-full h-full">
        <h3 className="text-lg font-semibold">{area}</h3>
      </div>
    </div>
  );
}
