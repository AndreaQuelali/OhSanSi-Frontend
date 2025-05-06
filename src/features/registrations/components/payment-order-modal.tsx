import { Button, ButtonIcon } from "@/components";
import CloseIcon from "@/components/icons/close";
import React from "react";

interface PaymentData {
  ci: string;
  nombres: string;
  apellidos: string;
  cantidadOlimpistas: number;
  total: number;
  totalLiteral: string;
  fecha: string;
  hora: string;
  nroOrden: string;
}

interface PaymentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  data: PaymentData;
}

const PaymentOrderModal: React.FC<PaymentPreviewModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  data
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral2 opacity-40"
        onClick={onClose}
      />
      <div className="w-[90%] max-w-[816px] bg-white rounded-xl p-6 relative z-50">
        <div className="w-full flex justify-end">
          <ButtonIcon
            icon={CloseIcon}
            onClick={onClose}
            variantColor="variant2"
          />
        </div>

        <div className="flex justify-between items-start">
          <img src="/assets/images/logoUMSS.png" alt="Logo UMSS" className="w-40" />
          <div className="text-right">
            <div className="flex flex-row items-center gap-1">
            <img src="/assets/images/ohsansi2.png" alt="Logo Sansi" className="w-20 mx-auto" />
            <p className="text-secondary subtitle-md"><strong>Sansi!</strong></p>
            </div>
          </div>
        </div>

        <h2 className="headline-md text-primary text-center mb-4">ORDEN DE PAGO</h2>
        <p className="text-right headline-sm text-secondary">N° {data.nroOrden}</p>

        <div className="mb-4">
          <p className="subtitle-md text-primary mb-4">Responsable:</p>
          <div className="ml-10">
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
              <td className="border border-black px-2 py-3 subtitle-md">Cantidad de olimpistas inscritos</td>
              <td className="border border-black px-2 py-3 subtitle-md">{data.cantidadOlimpistas}</td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-3"><strong>Total pago:</strong></td>
              <td className="border border-black px-2 py-3"><strong>{data.total}</strong></td>
            </tr>
          </tbody>
        </table>

        <p className="mb-2">{data.totalLiteral}</p>
        <p className="text-sm">Fecha: {data.fecha} Hora: {data.hora}</p>

        <div className="flex justify-end space-x-4 mt-6">
          <Button onClick={onClose} label="Cancelar" variantColor="variant2" />
          <Button onClick={onDownload} label="Descargar" />
        </div>
      </div>
    </div>
  );
};

export default PaymentOrderModal;
