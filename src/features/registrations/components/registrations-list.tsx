import React, { useState } from 'react';
import RegistrationCard from './registration-card';
import { Button, InputText } from '@/components';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { Registration, RegistrationData, RegistrationsListProps, FormData } from '../interfaces/registrations';


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
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getRegistrations = async (ci: string) => {
    setLoading(true);
    setErrorMessage('');
    try {
      if (showUploadButton || title.includes('Subir comprobante de pago')) {
        try {
          console.log('PASasaaaa');
          const paymentResponse = await axios.get(
            `${API_URL}/consulta-pago/${ci}`,
          );
          const paymentData = paymentResponse.data;

          if (!paymentData.existe) {
            setErrorMessage(paymentData.mensaje);
            setData([]);
            return;
          }
        } catch (paymentErr: any) {
          console.error('Error al consultar pago:', paymentErr);
          setErrorMessage('Error al consultar el estado del pago.');
          setData([]);
          return;
        }
      }

      let endpoint = `${API_URL}/inscripciones/${ci}/PENDIENTE`;

      if (title === 'Registros de Inscripciones' && !showGenerateButton) {
        endpoint = `${API_URL}/inscripciones/${ci}/TODOS`;
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
                id_lista: item.id_lista,
                tipo: 'individual',
              },
              registrations,
            };
          }

          // Grupal
          if (item.detalle?.tipo === 'grupal') {
            return {
              list: {
                cantidad: item.detalle.cantidad_inscripciones || 0,
                cantidadOlimpistas: item.detalle.cantidad_estudiantes || 0,
                responsable: responsableName,
                ci: responsable?.ci || 'Sin CI',
                estado: item.estado || 'Pendiente',
                id_lista: item.id_lista,
                tipo: 'grupal',
              },
              registrations: [],
            };
          }

          return null;
        })
        .filter(Boolean) as RegistrationData[];

      setData(mapped);
    } catch (err: any) {
      console.error('Error al obtener inscripciones', err);
      setData([]);

      if (
        !showUploadButton &&
        !title.includes('Verificar') &&
        (err.response?.status === 404 || !err.response)
      ) {
        try {
          const paymentResponse = await axios.get(
            `${API_URL}/consulta-pago/${ci}`,
          );
          const paymentData = paymentResponse.data;

          if (!paymentData.existe) {
            setErrorMessage(paymentData.mensaje);
          } else {
            setErrorMessage('No se encontraron inscripciones asociadas.');
          }
        } catch (paymentErr: any) {
          setErrorMessage('No se encontraron inscripciones asociadas.');
        }
      } else {
        setErrorMessage('Error al consultar las inscripciones.');
      }
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
        className="mb-32 w-11/12 md:w-10/12 lg:w-full flex flex-col items-center justify-center"
      >
        <h1 className="text-center text-primary mb-8 headline-lg">{title}</h1>
        <div className="flex flex-col md:flex-row md:gap-5 lg:gap-16 w-full lg:w-10/12 items-center justify-center">
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
          <div className="flex flex-col w-full md:w-auto">
            <Button
              type="submit"
              label="Consultar"
              variantColor={loading ? 'variantDesactivate' : 'variant1'}
              disabled={loading}
            />
          </div>
        </div>
        <div className="mt-10 min-w-11/12 md:min-w-10/12">
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
          {!loading && data.length === 0 && errorMessage && (
            <p className="text-center text-gray-500 mt-8">{errorMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
};
export default RegistrationsList;
