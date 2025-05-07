import { Button } from "@/components";
import React, { useState } from "react";
import PaymentOrderModal from "./payment-order-modal";

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
  isAlternate?: boolean;
};

const RegistrationCard: React.FC<Props> = ({ list, registrations, isAlternate }) => {
  const isGroup = list.cantidad > 1;
  const [showVisualModal, setShowVisualModal] = useState(false);

  const handleOpenVisualModal = () => setShowVisualModal(true);

  return (
    <div
      className={`card w-full h-full flex flex-col gap-4 py-6 px-10 rounded-2xl ${
        isAlternate ? "bg-surface" : "bg-white"
      }`}
    >
      <h4 className="subtitle-md text-primary">
        <strong>{isGroup ? "Inscripción por lista" : "Inscripción"}</strong>
      </h4>
      <div className="flex flex-row gap-16">
        <div className="flex flex-col gap-1 min-w-1/4">
          <p className="subtitle-md"><strong>Responsable: </strong>{list.responsable}</p>
          {!isGroup && <p><strong>Estudiante: </strong> {registrations[0]?.nombre}</p>}
          {isGroup && <p><strong>Nro de inscripciones:</strong> {list.cantidad}</p>}
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
          <Button
            label={isGroup ? "Generar boleta por lista" : "Generar boleta"}
            onClick={handleOpenVisualModal}
          />
        </div>

        {/* Modal de Visualización */}
        {showVisualModal && (
          <PaymentOrderModal
            isOpen={showVisualModal}
            onClose={() => setShowVisualModal(false)}
            data={{
              ci: list.ci,
              nombres: "Nombre del responsable", // reemplaza con datos reales
              apellidos: "Apellido del responsable",
              cantidadOlimpistas: list.cantidad,
              total: list.cantidad * 10,
              totalLiteral: "Cien bolivianos",
              fecha: new Date().toLocaleDateString(),
              hora: new Date().toLocaleTimeString(),
              nroOrden: "OP-00123",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RegistrationCard;
