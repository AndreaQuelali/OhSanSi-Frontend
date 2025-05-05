import { Button } from "@/components";
import React from "react";

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

type Props = {
    list: List;
    registrations: Registration[];
    isAlternate?: boolean; // <- nueva prop
  };
  
  const RegistrationCard: React.FC<Props> = ({ list, registrations, isAlternate }) => {
    const isGroup = list.cantidad > 1;
  
    return (
      <div
        className={`card w-10/12 h-full flex flex-col gap-4 py-6 px-10 rounded-2xl ${
          isAlternate ? "bg-surface" : "bg-white"
        }`}
      >
        <h4 className="subtitle-md text-primary">
          <strong>{isGroup ? "Inscripción por lista" : "Inscripción"}</strong>
        </h4>
        <div className="flex flex-row gap-16">
          {/* Columnas */}
          <div className="flex flex-col gap-1 min-w-1/4">
            <p className="subtitle-md"><strong>Responsable: </strong>{list.responsable}</p>
            {!isGroup && <p><strong>Estudiante: </strong> {registrations[0]?.nombre}</p>}
            {isGroup && <p><strong>Nro de estudiantes:</strong> {list.cantidad}</p>}
          </div>
          <div className="flex flex-col gap-1 min-w-1/12">
            <p className="subtitle-md"><strong>CI:</strong> {list.ci}</p>
            {!isGroup && <p className="subtitle-md"><strong>CI:</strong> {registrations[0]?.ci}</p>}
          </div>
          {!isGroup && (
            <div className="flex flex-col gap-1 min-w-1/6">
              <p className="subtitle-md"><strong>Área:</strong> {registrations[0]?.area}</p>
              <p className="subtitle-md"><strong>Nivel/Categoría:</strong> {registrations[0]?.categoria}</p>
            </div>
          )}
          {isGroup && <div className="flex flex-col gap-1 min-w-1/6"></div>}
  
          <div className="flex flex-col gap-1 min-w-1/8">
            <p className="subtitle-md"><strong>Estado:</strong> {list.estado}</p>
          </div>
          <div className="flex flex-col gap-2 ml-auto">
            <Button label={isGroup ? "Generar boleta por lista" : "Generar boleta"} />
          </div>
        </div>
      </div>
    );
  };  

export default RegistrationCard;
