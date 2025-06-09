import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Button, ButtonIcon } from '@/components';
import CloseIcon from '@/components/icons/close';

interface PaymentData {
  ci: string;
  nombres: string;
  apellidos: string;
  total: number;
  fecha: string;
  hora: string;
  nroOrden: string;
  unitario: number;
  niveles: { nivel_id: number; nombre_nivel: string; area: string }[];
}

interface PaymentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PaymentData;
}

export const PaymentOrderModalInd: React.FC<PaymentPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    await new Promise((r) => setTimeout(r, 100)); 
    if (contentRef.current) {
      const opt = {
        margin: 0.5,
        filename: `OrdenPago_${data.nroOrden}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
      await html2pdf().set(opt).from(contentRef.current).save();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral2 opacity-40"
        onClick={onClose}
      />
      <div className="w-4xl bg-white rounded-xl p-6 relative z-50">
        <div className="w-full flex justify-end">
          <ButtonIcon
            icon={CloseIcon}
            onClick={onClose}
            variantColor="variant2"
          />
        </div>
        <div ref={contentRef} className="px-6">
          <img
            src="/assets/images/logoUMSS (1).png"
            alt="Logo UMSS"
            className="w-40"
          />
          {/* <p className="text-right subtitle-md text-secondary">
            N° {data.nroOrden}
          </p> */}
          <h2 className="headline-md text-primary text-center mb-3">
            ORDEN DE PAGO
          </h2>

          <div className="mb-2 subtitle-sm flex justify-between">
            <p className=" text-onBack ">
              <strong className="text-primary">Señor(es):</strong>{' '}
              {data.nombres} {data.apellidos}
            </p>
            <p className=" text-onBack pr-10">
              <strong className="text-primary">CI:</strong> {data.ci}
            </p>
          </div>
          <div className="mb-2 subtitle-sm flex justify-between">
            <p className=" text-primary">
              <strong>Por lo siguiente:</strong>
            </p>
          </div>
          <table className="w-full table-fixed mb-10 mt-10 text-center">
            <thead>
              <tr>
                <th className="w-1/3 border-b border-[#E0E0E0] subtitle-sm px-2 py-2 text-onBack text-center"><strong>CANTIDAD</strong></th>
                <th className="w-1/3 border-b border-[#E0E0E0] subtitle-sm px-2 py-2 text-onBack text-center"><strong>CONCEPTO</strong></th>
                <th className="w-1/3 border-b border-[#E0E0E0] subtitle-sm px-2 py-2 text-onBack text-center"><strong>P.UNITARIO</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="w-1/3 border-b border-[#E0E0E0] px-2 py-3 body-sm text-onBack text-center">{data.niveles.length}</td>
                <td className="w-1/3 border-b border-[#E0E0E0] px-2 py-3 body-sm text-onBack text-center">Inscripciones</td>
                <td className="w-1/3 border-b border-[#E0E0E0] px-2 py-3 body-sm text-onBack text-center">{data.unitario.toFixed(2)} Bs</td>
              </tr>
              <tr>
                <td className="w-1/3 border-b border-[#E0E0E0] px-2 py-3 body-sm text-onBack text-center">1</td>
                <td className="w-1/3 border-b border-[#E0E0E0] px-2 py-3 body-sm text-onBack text-center font-semibold">Total</td>
                <td className="w-1/3 border-b border-[#E0E0E0] px-2 py-3 body-sm text-onBack text-center font-semibold">{data.total.toFixed(2)} Bs</td>
              </tr>
            </tbody>
          </table>

          <p className=" text-onBack body-sm mb-2">
            <strong className="text-primary">Nota:</strong> No vale como factura
            oficial
          </p>
          <p className=" text-onBack subtitle-sm mb-2 ">
            <strong className="text-primary">Son:</strong> {data.total}{' '}
            Bolivianos
          </p>
          <div className="mb-2 subtitle-sm flex space-x-10">
            <p className=" text-onBack">
              <strong className="text-primary">Fecha:</strong> {data.fecha}
            </p>
            <p className=" text-onBack">
              <strong className="text-primary">Hora:</strong> {data.hora}
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6 px-6">
          <Button onClick={handleDownload} label="Descargar" />
        </div>
      </div>
    </div>
  );
};
