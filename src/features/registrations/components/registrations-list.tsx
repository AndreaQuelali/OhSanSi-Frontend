import React, { useState } from "react";
import RegistrationCard from "./registration-card";
import { Button, InputText } from "@/components";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from '@/config/api-config';

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
};

type RegistrationData = {
  list: List;
  registrations: Registration[];
};

type FormData = {
  ci: string;
};

const RegistrationsList: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  const [data, setData] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(false);

  const getRegistrations = async (ci: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/inscripciones/${ci}`);
      const inscripciones = response.data.data;

      const mapped: RegistrationData[] = inscripciones.map((item: any) => {
        const inscripciones = item.detalle.tipo === "grupal"
          ? item.detalle.inscripciones
          : [item.detalle];

        const registrations: Registration[] = inscripciones.map((i: any) => ({
          nombre: i.olimpista?.nombre || "Desconocido",
          ci: i.olimpista?.ci || "Sin CI",
          area: i.nivel?.area || "Sin área",
          categoria: i.nivel?.nombre || "Sin categoría",
        }));

        return {
          list: {
            cantidad: registrations.length,
            responsable: item.nombre_responsable || "No especificado",
            ci: item.ci_responsable_inscripcion,
            estado: item.estado || "Pendiente",
          },
          registrations,
        };
      });

      setData(mapped);
    } catch (err) {
      console.error("Error al obtener inscripciones", err);
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
    <div className="w-full h-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full flex flex-col items-center justify-center"
      >
        <h1 className="text-center text-primary mb-8 headline-lg">
          Inscripciones
        </h1>
        <div className="flex flex-row gap-16 w-10/12 items-center justify-center">
          <InputText
            label="Ingrese el CI del responsable para ver las inscripciones asociadas al mismo"
            name="ci"
            placeholder="Ingresar cédula de identidad"
            className="w-full"
            register={register}
            errors={errors}
            validationRules={{
              required: "El CI es obligatorio",
              minLength: { value: 4, message: "Debe tener al menos 4 dígitos" },
            }}
          />
          <Button type="submit" label="Consultar" disabled={loading} />
        </div>
      </form>

      <div className="mt-10 w-10/12 mx-auto">
        {data.map((item, index) => (
          <RegistrationCard
            key={index}
            list={item.list}
            registrations={item.registrations}
            isAlternate={index % 2 === 0}
          />
        ))}
        {!loading && data.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No se encontraron inscripciones asociadas.
          </p>
        )}
      </div>
    </div>
  );
};

export default RegistrationsList;
