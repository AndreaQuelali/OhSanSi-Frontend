import CardArea from './card-area';

interface NivelType {
  id_nivel: number;
  nombre_nivel: string;
  registrado?: boolean;
}

interface AreasGridSectionProps {
  loading: boolean;
  olimpistaError: string | null;
  areasDisponibles: Record<string, NivelType[]>;
  nivelesSeleccionados: Record<string, NivelType[]>;
  onAreaClick: (area: string) => void;
}

export default function AreasGridSection({
  loading,
  olimpistaError,
  areasDisponibles,
  nivelesSeleccionados,
  onAreaClick,
}: AreasGridSectionProps) {
  return (
    <section className="min-h-[300px]">
      <h2 className="text-primary subtitle-lg text-center font-bold mb-6 md:text-left sm:text-left headline-lg">
        Áreas Disponibles
      </h2>
      {loading ? (
        <p className="text-center">Cargando áreas disponibles...</p>
      ) : olimpistaError ? (
        <p className="text-error text-center">{olimpistaError}</p>
      ) : Object.keys(areasDisponibles).length === 0 ? (
        <p className="text-center text-gray-500 mt-4 text-lg font-roboto">
          No hay áreas disponibles aún. Por favor, ingrese la cédula del
          olimpista.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Object.entries(areasDisponibles).map(([area, niveles]) => (
            <CardArea
              key={area}
              area={area}
              niveles={niveles}
              onClick={() => onAreaClick(area)}
              nivelesSeleccionados={nivelesSeleccionados[area] || []}
            />
          ))}
        </div>
      )}
    </section>
  );
}
