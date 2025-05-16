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
  tipo: "individual" | "grupal";
};

type PaymentData = {
  ci: string;
  nombres: string;
  apellidos: string;
  cantidadOlimpistas: number;
  total: number;
  unitario: number; 
  niveles: { nivel_id: number; nombre_nivel: string; area: string }[]; 
  totalLiteral: string;
  fecha: string;
  hora: string;
  nroOrden: string;
};

type Props = {
  list: List;
  registrations: Registration[];
  isAlternate?: boolean;
  showGenerateButton?: boolean;
};

const RegistrationCard: React.FC<Props> = ({ list, registrations, isAlternate, showGenerateButton}) => {
  console.log("list en RegistrationCard:", list); 
  const isGroup = list.tipo === "grupal";
  const [showVisualModal, setShowVisualModal] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const [modalTipo, setModalTipo] = useState<"individual" | "grupal" | null>(null);

  const convertirNumeroALetras = (monto: number): string => {
    return `Son: ${monto} Bolivianos`;
  };

  const handleOpenVisualModal = async () => {
    try {
      
      const inscripcionResp = await axios.get(`${API_URL}/inscripciones/${list.ci}/PENDIENTE`);
      const listas = inscripcionResp.data.listas;
  
      console.log("list.id_lista:", list.id_lista);
      console.log("listas:", listas);
      const listaEncontrada = listas.find((l: any) => l.id_lista === Number(list.id_lista));
      console.log("Lista encontrada:", listaEncontrada);
      if (!listaEncontrada) throw new Error("No se encontró la lista de inscripción");
  
      const tipo = listaEncontrada.detalle.tipo as "individual" | "grupal";
      setModalTipo(tipo); 
  
      let paymentDataTemp: PaymentData;
  
      if (tipo === "grupal") {
        const response = await axios.get(`${API_URL}/boleta-de-pago-grupal/${list.id_lista}`);
        const { responsable, pago, detalle_grupo } = response.data;
  
        paymentDataTemp = {
          ci: responsable.ci,
          nombres: responsable.nombres,
          apellidos: responsable.apellidos,
          cantidadOlimpistas: detalle_grupo.participantes_unicos,
          total: pago.total_a_pagar,
          unitario: pago.monto_unitario,
           niveles: [], 
          totalLiteral: convertirNumeroALetras(pago.total_a_pagar), 
          fecha: new Date(pago.fecha_pago).toLocaleDateString(),
          hora: new Date(pago.fecha_pago).toLocaleTimeString(),
          nroOrden: pago.referencia,
        };
  
      } else {
        const response = await axios.get(`${API_URL}/boleta-de-pago-individual/${list.id_lista}`);
        const { responsable, pago, niveles } = response.data;

        const fechaPago = new Date(pago.fecha_pago);

        paymentDataTemp = {
          ci: responsable.ci,
          nombres: responsable.nombres,
          apellidos: responsable.apellidos,
          cantidadOlimpistas: pago.total_inscripciones ?? 1,
          total: pago.total_a_pagar,
          unitario: pago.monto_unitario,
          niveles,
          totalLiteral: convertirNumeroALetras(pago.total_a_pagar),
          fecha: fechaPago.toLocaleDateString(),
          hora: fechaPago.toLocaleTimeString(),
          nroOrden: pago.referencia,
        };
      }
  
      setPaymentData(paymentDataTemp);
      setShowVisualModal(true);
  
    } catch (error) {
      console.error("Error al abrir boleta", error);
    }
  };  

  return (
    <div
      className={`card w-full h-full flex flex-col gap-4 py-6 px-10 rounded-2xl ${
        isAlternate ? "bg-surface" : "bg-white"
      }`}
    >
      <h4 className="subtitle-md text-primary">
        <strong>Inscripción</strong>
      </h4>
      <div className="flex flex-row gap-10">
        <div className="flex flex-col gap-1 min-w-1/4">
          <p className="subtitle-md"><strong>Responsable: </strong>{list.responsable}</p>
          {!isGroup && <p className="subtitle-md"><strong>Estudiante: </strong> {registrations[0]?.nombre}</p>}
          {!isGroup && (
            <p className="subtitle-md">
              <strong>Nro de inscripciones:</strong> {registrations.length}
            </p>
          )}
          {isGroup && <p className="subtitle-md"><strong>Nro de inscripciones:</strong> {list.cantidad}</p>}
        </div>
        <div className="flex flex-col gap-1 min-w-1/12">
          <p className="subtitle-md"><strong>CI:</strong> {list.ci}</p>
          {!isGroup && <p className="subtitle-md"><strong>CI:</strong> {registrations[0]?.ci}</p>}
        </div>
        {!isGroup && (
          <div className="flex flex-col gap-1 min-w-3/12">
            {registrations.map((reg, idx) => (
              <div key={idx}>
                <p className="subtitle-md"><strong>Área:</strong> {reg.area}</p>
                <p className="subtitle-md"><strong>Nivel/Categoría:</strong> {reg.categoria}</p>
              </div>
            ))}
          </div>
        )}
        {isGroup && <div className="flex flex-col gap-1 min-w-3/12"></div>}

        <div className="flex flex-col gap-1 min-w-1/8">
          <p className="subtitle-md"><strong>Estado:</strong> {list.estado}</p>
        </div>
        {showGenerateButton && (
          <div className="flex flex-col gap-2 ml-auto">
            <Button
              label={isGroup ? "Generar boleta" : "Generar boleta"}
              onClick={handleOpenVisualModal}
            />
          </div>
        )}

        {showVisualModal && paymentData && modalTipo === "grupal" && (
          <PaymentOrderModal
            isOpen={showVisualModal}
            onClose={() => setShowVisualModal(false)}
            data={paymentData}
          />
        )}

        {showVisualModal && paymentData && modalTipo === "individual" && (
          <PaymentOrderModalInd
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
