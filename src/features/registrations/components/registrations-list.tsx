import React, { useState } from 'react';
import RegistrationCard from './registration-card';
import { Button, InputText } from '@/components';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_URL } from '@/config/api-config';

// Tipos para los datos de inscripción
type Registration = {
  nombre: string;
  ci: string;
  area: string;
  categoria: string;
};

type List = {
  cantidad: number;
  responsable: string;
  ci: string;
  estado: string;
  id_lista?: number;
};

type RegistrationData = {
  list: List;
  registrations: Registration[];
};

type FormData = {
  ci: string;
};

type RegistrationsListProps = {
  showGenerateButton?: boolean; // opcional, por defecto false
  showUploadButton?: boolean;
  title?: string;
};

const RegistrationsList: React.FC<RegistrationsListProps> = ({
  showGenerateButton = false,
  title = 'Inscripciones',
  showUploadButton = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange' });

  const [data, setData] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(false);

  const getRegistrations = async (ci: string) => {
    setLoading(true);
    try {
      let endpoint = `${API_URL}/inscripciones/${ci}/PENDIENTE`;

      if (title === 'Inscripciones' && !showGenerateButton) {
        endpoint = `${API_URL}/inscripciones/${ci}/PAGADO`;
      }

      const response = await axios.get(endpoint);
      const { responsable, listas } = response.data;

      if (!Array.isArray(listas)) {
        throw new Error("El campo 'listas' no es un arreglo.");
      }

      // Obtenemos el responsable antes de usarlo
      const responsableName =
        `${responsable?.nombres || ''} ${responsable?.apellidos || ''}`.trim();

      const mapped: RegistrationData[] = listas
        .map((item: any) => {
          // Individual
          if (item.detalle?.tipo === 'individual') {
            const olimpista = item.detalle.olimpista;
            const niveles = item.detalle.niveles || [];

            const registrations: Registration[] = niveles.map((nivel: any) => ({
              nombre:
                `${olimpista?.nombres || ''} ${olimpista?.apellidos || ''}`.trim(),
              ci: olimpista?.ci || 'Sin CI',
              area: nivel.area || 'Sin área',
              categoria: nivel.nombre || 'Sin categoría',
            }));

            return {
              list: {
                cantidad: registrations.length,
                responsable: responsableName,
                ci: responsable?.ci || 'Sin CI',
                estado: item.estado || 'Pendiente',
                id_lista: item.id_lista, // Asegúrate de incluir `id_lista` para inscripciones individuales
              },
              registrations,
            };
          }

          // Grupal
          if (item.detalle?.tipo === 'grupal') {
            return {
              list: {
                cantidad: item.detalle.cantidad_estudiantes || 0,
                responsable: responsableName,
                ci: responsable?.ci || 'Sin CI',
                estado: item.estado || 'Pendiente',
                id_lista: item.id_lista, // Aquí también
              },
              registrations: [], // No hay detalle de estudiantes en este caso
            };
          }

          return null;
        })
        .filter(Boolean) as RegistrationData[];

      setData(mapped);
    } catch (err) {
      console.error('Error al obtener inscripciones', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (values: FormData) => {
    if (values.ci && values.ci.length >= 4) {
      getRegistrations(values.ci);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-32 w-11/12 md:w-9/12 lg:w-10/12"
      >
        <h1 className="text-center text-primary mb-8 headline-lg">{title}</h1>
        <div className="flex flex-row gap-16 w-10/12 items-center justify-center">
          <InputText
            label="Ingrese el CI del responsable para ver las inscripciones asociadas al mismo"
            name="ci"
            placeholder="Ingresar cédula de identidad"
            className="w-full"
            register={register}
            errors={errors}
            validationRules={{
              required: 'El CI es obligatorio',
              minLength: { value: 4, message: 'Debe tener al menos 4 dígitos' },
            }}
          />
          <Button type="submit" label="Consultar" disabled={loading} />
        </div>
        <div className="mt-10 min-w-10/12 mx-auto">
          {data.map((item, index) => (
            <RegistrationCard
              key={index}
              list={item.list}
              registrations={item.registrations}
              isAlternate={index % 2 === 0}
              showGenerateButton={showGenerateButton}
              showUploadButton={showUploadButton}
            />
          ))}
          {!loading && data.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              No se encontraron inscripciones asociadas.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegistrationsList;
