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
  return (
    <div
      className="relative flex flex-col justify-center items-center rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 shadow-lg border border-gray-100 w-full"
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 w-full h-3 bg-secondary2 rounded-t-3xl"></div>
      <div className="flex flex-col items-center justify-center mt-6 p-4">
        <h3 className="text-primary font-semibold text-lg">{area}</h3>
        {nivelesSeleccionados.length > 0 && (
          <p className="mt-2 text-center text-gray-700">
            {nivelesSeleccionados.map((nivel) => nivel.nombre_nivel).join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}
