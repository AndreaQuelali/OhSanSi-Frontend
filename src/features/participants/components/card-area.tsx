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

  const cantidadNivelesRegistrados = nivelesSeleccionados.filter(
    (nivel) => nivel.registrado,
  ).length;

  const cantidadNivelesSeleccionados = nivelesSeleccionados.filter(
    (nivel) => !nivel.registrado,
  ).length;

  const nivelesDisponibles = niveles.length;
  const nivelesOcupados = nivelesSeleccionados.length;
  const nivelesDisponiblesSinSeleccionar = nivelesDisponibles - nivelesOcupados;
  const esAreaRegistrada = tieneNivelesRegistrados;
  const esAreaSeleccionada = nivelesSeleccionados.length > 0;

  return (
    <div
      className={`border ${
        esAreaRegistrada
          ? 'border-primary bg-green-50'
          : esAreaSeleccionada
            ? 'border-primary bg-blue-50'
            : 'border-gray-400 bg-white'
      } rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-gray-800">{area}</h3>

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
            <span className="font-medium">Niveles registrados:</span>{' '}
            {cantidadNivelesRegistrados}
          </div>
        )}
        {cantidadNivelesSeleccionados > 0 && (
          <div className="mt-1">
            <span className="font-medium">Niveles seleccionados:</span>{' '}
            {cantidadNivelesSeleccionados}
          </div>
        )}
        <div className="mt-1">
          <span className="font-medium">Niveles disponibles:</span>{' '}
          {nivelesDisponiblesSinSeleccionar}
        </div>
      </div>

    </div>
  );
}
