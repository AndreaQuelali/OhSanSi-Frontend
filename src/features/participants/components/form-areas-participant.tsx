import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { InputText } from '@/components';
import { API_URL } from '@/config/api-config';

export default function FormAreaPart() {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();

  const [areasDisponibles, setAreasDisponibles] = useState<
    Record<string, { id_nivel: number; nombre_nivel: string }[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ciTutor = watch('tutor.ci');
  const ciOlimpista = watch('olimpista.ci');

  useEffect(() => {
    const fetchAreasDisponibles = async () => {
      if (ciTutor && ciOlimpista) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${API_URL}/verificar-inscripcion`, {
            params: { ci_tutor: ciTutor, ci_olimpista: ciOlimpista },
          });
          setAreasDisponibles(response.data.areas_disponibles || {});
        } catch (err) {
          setError('Error al cargar las áreas disponibles.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAreasDisponibles();
  }, [ciTutor, ciOlimpista]);

  return (
    <div className="my-6">
      <div className="max-w-9/12 mx-auto w-full px-0 sm:px-6 md:px-0">
        <h2 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6 md:text-center sm:text-left headline-lg">
          Registro de Olimpista con tutor en una o varias áreas.
        </h2>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 mt-10">
          <InputText
            label="Cédula de identidad del tutor"
            name="tutor.ci"
            placeholder="Ingrese su número de cédula"
            className="w-full"
            register={register}
            validationRules={{
              required: 'La cédula es obligatoria',
              pattern: {
                value: /^(?! )[0-9]+(?<! )$/,
                message: 'Solo se permiten números y no puede haber espacios',
              },
            }}
            errors={errors}
          />
          <InputText
            label="Cédula de identidad del olimpista"
            name="olimpista.ci"
            placeholder="Ingrese su número de cédula"
            className="w-full"
            register={register}
            validationRules={{
              required: 'La cédula es obligatoria',
              pattern: {
                value: /^(?! )[0-9]+(?<! )$/,
                message: 'Solo se permiten números y no puede haber espacios',
              },
            }}
            errors={errors}
          />
        </section>
        <section>
          <h2 className="text-primary subtitle-lg">Áreas Disponibles</h2>
          {loading ? (
            <p>Cargando áreas disponibles...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {Object.entries(areasDisponibles).map(([area, niveles]) => (
                <div
                  key={area}
                  className="relative flex flex-col justify-center items-center rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 shadow-lg border border-gray-100 w-full"
                >
                  <div className="absolute top-0 left-0 w-full h-3 bg-primary rounded-t-3xl"></div>
                  <div className="flex flex-col items-center justify-center mt-6 p-4">
                    <h3 className="text-primary font-semibold text-lg">
                      {area}
                    </h3>
                    <ul className='mt-2'>
                      {niveles.map((nivel) => (
                        <li key={nivel.id_nivel} className="text-center">
                          {nivel.nombre_nivel}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
