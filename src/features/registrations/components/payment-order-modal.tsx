import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { Button, ButtonIcon } from "@/components";
import CloseIcon from "@/components/icons/close";

interface PaymentData {
  ci: string;
  nombres: string;
  apellidos: string;
  cantidadOlimpistas: number;
  unitario: number; 
  total: number;
  totalLiteral: string;
  fecha: string;
  hora: string;
  nroOrden: string;
}

interface PaymentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PaymentData;
}

const PaymentOrderModal: React.FC<PaymentPreviewModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (contentRef.current) {
      const opt = {
        margin:       0.5,
        filename:     `OrdenPago_${data.nroOrden}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 3 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(contentRef.current).save();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral2 opacity-40"
        onClick={onClose}
      />
      <div className="w-[90%] max-w-[816px] bg-white rounded-xl p-6 relative z-50">
        {/* ... todo el contenido del modal ... */}

        <div className="w-full flex justify-end">
          <ButtonIcon
            icon={CloseIcon}
            onClick={onClose}
            variantColor="variant2"
          />
        </div>
        <div  ref={contentRef}>
                        {/* Logos y encabezados */}
            <div className="flex justify-between items-start">
            <img src="/assets/images/logoUMSS (1).png" alt="Logo UMSS" className="w-40" />
            </div>
            <p className="text-right subtitle-md text-secondary">N° {data.nroOrden}</p>
            <h2 className="headline-md text-primary text-center mb-4">ORDEN DE PAGO</h2>

            <div className="mb-4">
            <p className="subtitle-md text-onBack mb-4"><strong>Responsable:</strong></p>
            <div className="ml-10 mb-6">
                <p className="subtitle-md"><strong>CI:</strong> {data.ci}</p>
                <p className="subtitle-md"><strong>Nombre(s):</strong> {data.nombres}</p>
                <p className="subtitle-md"><strong>Apellido(s):</strong> {data.apellidos}</p>
            </div>
            </div>

            <table className="w-full border border-black mb-4">
            <thead>
                <tr>
                <th className="border subtitle-md border-black text-left px-2 py-3"><strong>DETALLE</strong></th>
                <th className="border subtitle-md border-black text-left px-2 py-3"><strong>VALOR</strong></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td className="border border-black px-2 py-3 subtitle-md">Cantidad de inscripciones</td>
                <td className="border border-black px-2 py-3 subtitle-md">{data.cantidadOlimpistas}</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-3">Monto unitario por inscripción</td>
                  <td className="border border-black px-2 py-3">{data.unitario}</td>
                </tr>
                <tr>
                <td className="border border-black px-2 py-3"><strong>Total pago:</strong></td>
                <td className="border border-black px-2 py-3"><strong>{data.total}</strong></td>
                </tr>
            </tbody>
            </table>

            <p className="mb-2">{data.totalLiteral}</p>
            <p className="text-sm mb-5">Fecha: {data.fecha} Hora: {data.hora}</p>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
            <Button onClick={onClose} label="Cancelar" variantColor="variant2" />
            <Button onClick={handleDownload} label="Descargar" />
        </div>
      </div>
    </div>
  );
};

export default PaymentOrderModal;
