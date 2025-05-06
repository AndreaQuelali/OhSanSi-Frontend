import React, { useEffect, useState } from "react";
import RegistrationCard from "./registration-card";

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

const mockData: RegistrationData[] = [
  {
    list: {
      cantidad: 1,
      responsable: "Juan Pérez",
      ci: "12345678",
      estado: "Pendiente",
    },
    registrations: [
      {
        nombre: "Carlos Gómez",
        ci: "87654321",
        area: "Matemáticas",
        categoria: "Intermedio",
      },
    ],
  },
  {
    list: {
      cantidad: 3,
      responsable: "María Sánchez",
      ci: "11223344",
      estado: "Confirmado",
    },
    registrations: [
      { nombre: "Ana Ruiz", ci: "99887766", area: "Física", categoria: "Básico" },
      { nombre: "Luis Méndez", ci: "88776655", area: "Física", categoria: "Básico" },
      { nombre: "Sofía Castro", ci: "77665544", area: "Física", categoria: "Básico" },
    ],
  },
];

const RegistrationsList: React.FC = () => {

  const [data, setData] = useState<RegistrationData[]>([]);

  useEffect(() => {
    // Simulamos una carga inicial
    setTimeout(() => {
      setData(mockData);
    }, 500);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
            <h1 className="text-center text-primary mb-8 headline-lg">
            Inscripciones
            </h1>
            {data.map((item, index) => (
            <RegistrationCard
                key={index}
                list={item.list}
                registrations={item.registrations}
                isAlternate={index % 2 === 0} // alterna el fondo: blanco/surface/blanco/...
            />
            ))}    
    </div>
  );
};

export default RegistrationsList;
