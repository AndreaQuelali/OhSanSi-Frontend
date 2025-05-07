import { Button } from "@/components";
import React, { useState } from "react";
import PaymentOrderModal from "./payment-order-modal";
import { API_URL } from "@/config/api-config";
import axios from "axios";
import { PaymentOrderModalInd } from "./payment-order-modal-individual";

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

type PaymentData = {
  ci: string;
  nombres: string;
  apellidos: string;
  cantidadOlimpistas: number;
  total: number;
  totalLiteral: string;
  fecha: string;
  hora: string;
  nroOrden: string;
};

type Props = {
  list: List;
  registrations: Registration[];
  isAlternate?: boolean;
};

const RegistrationCard: React.FC<Props> = ({ list, registrations, isAlternate }) => {
  const isGroup = list.cantidad > 1;
  const [showVisualModal, setShowVisualModal] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const handleOpenVisualModal = async () => {
    if (!list.id_lista) return;
  
    try {
      const response = await axios.get(`${API_URL}/boleta-de-pago-grupal/${list.id_lista}`);
      const { responsable, pago, detalle_grupo } = response.data;
  
      setShowVisualModal(true);
  
      // Podrías pasar los datos reales al modal aquí
      setPaymentData({
        ci: responsable.ci,
        nombres: responsable.nombres,
        apellidos: responsable.apellidos,
        cantidadOlimpistas: detalle_grupo.participantes_unicos,
        total: pago.total_a_pagar,
        totalLiteral: "Debe convertir a texto aquí",
        fecha: new Date(pago.fecha_pago).toLocaleDateString(),
        hora: new Date(pago.fecha_pago).toLocaleTimeString(),
        nroOrden: pago.referencia,
      });
    } catch (error) {
      console.error("Error al obtener la boleta de pago grupal", error);
    }
  };

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
          <div className="flex flex-col gap-1 min-w-1/6 max-w-1/6">
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
        {showVisualModal && paymentData && (
          <PaymentOrderModal
            isOpen={showVisualModal}
            onClose={() => setShowVisualModal(false)}
            data={paymentData}
          />
        )}
      </div>
    </div>
  );
};

export default RegistrationCard;
