import { Button } from '@/components';
import IconClose from '@/components/icons/icon-close';
import { InputText } from '@/components';
import { FieldErrors, UseFormRegister, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';

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
  register: UseFormRegister<any>;
  errors: FieldErrors;
  tutorError: string | null;
  clearTutorError?: () => void;
  control?: any;
}

export default function AreaSelectionModal({
  selectedArea,
  areasDisponibles,
  nivelesSeleccionadosTemp,
  onToggleNivel,
  onAccept,
  onCancel,
  register,
  errors,
  tutorError,
  clearTutorError,
  control,
}: AreaSelectionModalProps) {
  const tutorCi = control
    ? useWatch({
        control,
        name: 'tutor.ci',
        defaultValue: '',
      })
    : '';
  const [isDeselecting, setIsDeselecting] = useState(false);

  useEffect(() => {
    if (nivelesSeleccionadosTemp.length > 0) {
      setIsDeselecting(false);
    }
  }, [nivelesSeleccionadosTemp]);

  const handleToggleNivel = (nivel: NivelType) => {
    if (nivelesSeleccionadosTemp.some((n) => n.id_nivel === nivel.id_nivel)) {
      setIsDeselecting(true);
    }
    onToggleNivel(nivel);
  };

  useEffect(() => {
    if (clearTutorError && (!tutorCi || tutorCi === '')) {
      clearTutorError();
    }
  }, [tutorCi, clearTutorError]);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-30 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div
          className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={onCancel}
        >
          <IconClose className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-semibold mb-4">Área: {selectedArea}</h3>

        <div className="mb-6">
          <InputText
            label="Cédula de identidad del tutor académico (Opcional)"
            name="tutor.ci"
            placeholder="Ingresar ci del tutor académico"
            className="w-full"
            register={register}
            isRequired={false}
            validationRules={{
              pattern: {
                value: /^(?! )[0-9]+(?<! )$/,
                message: 'Solo se permiten números y no puede haber espacios.',
              },
            }}
            errors={errors}
          />
          {tutorError && tutorCi && (
            <p className="text-error subtitle-sm mt-1">{tutorError}</p>
          )}
        </div>

        <h4 className="font-medium mb-2">Seleccione un nivel:</h4>

        <p className="text-sm text-gray-600 mb-4 font-medium">
          Solo puede seleccionar un nivel por área.
        </p>

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
                  handleToggleNivel(nivel);
                }
              }}
            >
              <div className="flex items-center justify-center">
                <div className="mr-2">
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      nivelesSeleccionadosTemp.some(
                        (n) => n.id_nivel === nivel.id_nivel && !n.registrado,
                      )
                        ? 'border-white bg-white'
                        : 'border-gray-400'
                    }`}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {nivelesSeleccionadosTemp.some(
                      (n) => n.id_nivel === nivel.id_nivel && !n.registrado,
                    ) && (
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    )}
                  </div>
                </div>
                <p>{nivel.nombre_nivel}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button label="Cancelar" variantColor="variant2" onClick={onCancel} />
          <Button
            label="Aceptar"
            variantColor={
              nivelesSeleccionadosTemp.length > 0 || isDeselecting
                ? 'variant1'
                : 'variantDesactivate'
            }
            onClick={onAccept}
            disabled={nivelesSeleccionadosTemp.length === 0 && !isDeselecting}
          />
        </div>
      </div>
    </div>
  );
}
