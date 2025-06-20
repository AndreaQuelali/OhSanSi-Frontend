interface NivelType {
  id_nivel: number;
  nombre_nivel: string;
  registrado?: boolean;
}

interface CardAreaProps {
  area: string;
  niveles: NivelType[];
  onClick: () => void;
  nivelesSeleccionados: NivelType[];
}

export default function CardArea({
  area,
  niveles,
  onClick,
  nivelesSeleccionados,
}: CardAreaProps) {
  const tieneNivelesRegistrados = nivelesSeleccionados.some(
    (nivel) => nivel.registrado,
  );

  const nivelesRegistrados = nivelesSeleccionados.filter(
    (nivel) => nivel.registrado,
  );

  const nivelesSeleccionadosNoRegistrados = nivelesSeleccionados.filter(
    (nivel) => !nivel.registrado,
  );

  const cantidadNivelesSeleccionados = nivelesSeleccionadosNoRegistrados.length;
  const nivelesDisponibles = niveles.length;
  const nivelesDisponiblesSinSeleccionar = nivelesDisponibles;
  const esAreaRegistrada = tieneNivelesRegistrados;
  const esAreaSeleccionada = nivelesSeleccionados.length > 0;
  const areaBloqueada = esAreaRegistrada;

  const handleClick = () => {
    if (!areaBloqueada) {
      onClick();
    }
  };

  return (
    <div
      className={`border ${
        esAreaRegistrada
          ? 'border-primary bg-primary'
          : esAreaSeleccionada
            ? 'border-primary border-2 bg-blue-50'
            : 'border-gray-400 bg-white'
      } rounded-lg p-4 ${
        areaBloqueada
          ? 'cursor-not-allowed opacity-80'
          : 'cursor-pointer hover:shadow-md'
      } transition-shadow`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h3
          className={`font-bold text-lg ${esAreaRegistrada ? 'text-white' : ' text-gray-800'}`}
        >
          {area}
        </h3>

        {esAreaRegistrada ? (
          <div className="inline-flex items-center bg-green-100 text-primary px-2 py-1 rounded text-sm">
            Área registrada
          </div>
        ) : esAreaSeleccionada ? (
          <div className="inline-flex items-center bg-blue-100 text-primary px-2 py-1 rounded text-sm">
            Área seleccionada
          </div>
        ) : (
          <div className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
            Área disponible
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600">
        {esAreaRegistrada && (
          <div className="mt-1">
            <ul className="list-disc mt-1">
              {nivelesRegistrados.map((nivel) => (
                <li
                  className="list-none text-center text-xl text-surface"
                  key={nivel.id_nivel}
                >
                  {nivel.nombre_nivel}
                </li>
              ))}
            </ul>
          </div>
        )}
        {cantidadNivelesSeleccionados > 0 && (
          <div className="mt-1">
            <span className="font-medium">Nivel seleccionado:</span>{' '}
            {nivelesSeleccionadosNoRegistrados
              .map((nivel) => nivel.nombre_nivel)
              .join(', ')}
          </div>
        )}
        {!areaBloqueada && cantidadNivelesSeleccionados === 0 && (
          <div className="mt-1">
            <span className="font-medium">Niveles disponibles:</span>{' '}
            {nivelesDisponiblesSinSeleccionar}
          </div>
        )}
      </div>
    </div>
  );
}
