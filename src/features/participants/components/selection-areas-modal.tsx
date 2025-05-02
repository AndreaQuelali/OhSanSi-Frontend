import { Button } from '@/components';
import IconClose from '@/components/icons/icon-close';

interface NivelType {
  id_nivel: number;
  nombre_nivel: string;
  registrado?: boolean;
}

interface AreaSelectionModalProps {
  selectedArea: string;
  areasDisponibles: Record<string, NivelType[]>;
  nivelesSeleccionadosTemp: NivelType[];
  onToggleNivel: (nivel: NivelType) => void;
  onAccept: () => void;
  onCancel: () => void;
}

export default function AreaSelectionModal({
  selectedArea,
  areasDisponibles,
  nivelesSeleccionadosTemp,
  onToggleNivel,
  onAccept,
  onCancel,
}: AreaSelectionModalProps) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-30 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div
          className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={onCancel}
        >
          <IconClose className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-semibold mb-4">
          Seleccione un nivel para el área: {selectedArea}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {areasDisponibles[selectedArea].map((nivel) => (
            <div
              key={nivel.id_nivel}
              className={`flex justify-center p-3 rounded-lg cursor-pointer border ${
                nivelesSeleccionadosTemp.some(
                  (n) => n.id_nivel === nivel.id_nivel,
                )
                  ? nivel.registrado
                    ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white border-primary'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
              onClick={() => {
                if (nivel.registrado) {
                  alert(
                    'Este nivel ya está registrado y no se puede deseleccionar.',
                  );
                } else {
                  onToggleNivel(nivel);
                }
              }}
            >
              <p>{nivel.nombre_nivel}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button label="Cancelar" variantColor="variant2" onClick={onCancel} />
          <Button label="Aceptar" variantColor="variant1" onClick={onAccept} />
        </div>
      </div>
    </div>
  );
}
