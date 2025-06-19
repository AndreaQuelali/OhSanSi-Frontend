import React from 'react';

interface PaymentOrderContentProps {
  formattedData: {
    ci: string;
    nombres: string;
    apellidos: string;
    total: number;
    fecha: string;
    hora: string;
    nroOrden: string;
    unitario: number;
    niveles: { nivel_id: number; nombre_nivel: string; area: string }[];
    formattedUnitario: string;
    formattedTotal: string;
    totalInWords: string;
  };
}

export const PaymentOrderContent: React.FC<PaymentOrderContentProps> = ({
  formattedData,
}) => {
  return (
    <>
      <img
        src="/assets/images/logoUMSS (1).png"
        alt="Logo UMSS"
        className="w-40"
      />

      <h2 className="headline-md text-primary text-center mb-3">
        ORDEN DE PAGO
      </h2>

      <div className="mb-2 subtitle-sm flex justify-between">
        <p className="text-onBack">
          <strong className="text-primary">Señor(es):</strong>{' '}
          {formattedData.nombres} {formattedData.apellidos}
        </p>
        <p className="text-onBack pr-10">
          <strong className="text-primary">CI:</strong> {formattedData.ci}
        </p>
      </div>

      <div className="mb-2 subtitle-sm flex justify-between">
        <p className="text-primary">
          <strong>Por lo siguiente:</strong>
        </p>
      </div>

      <table className="w-full table-fixed mb-10 mt-10 text-center">
        <thead>
          <tr>
            <th className="w-1/3 border-b border-[#E0E0E0] subtitle-sm px-2 py-2 text-onBack text-center">
              <strong>CANTIDAD</strong>
            </th>
            <th className="w-1/3 border-b border-[#E0E0E0] subtitle-sm px-2 py-2 text-onBack text-center">
              <strong>CONCEPTO</strong>
            </th>
            <th className="w-1/3 border-b border-[#E0E0E0] subtitle-sm px-2 py-2 text-onBack text-center">
              <strong>P.UNITARIO</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="w-1/3 border-b border-[#E0E0E0] px-2 py-3 body-sm text-onBack text-center">
              {formattedData.niveles.length}
            </td>
            <td className="w-1/3 border-b border-[#E0E0E0] px-2 py-3 body-sm text-onBack text-center">
              Inscripciones
            </td>
            <td className="w-1/3 border-b border-[#E0E0E0] px-2 py-3 body-sm text-onBack text-center">
              {formattedData.formattedUnitario}
            </td>
          </tr>
          <tr>
            <td className="w-1/3 border-b border-[#E0E0E0] px-2 py-3 body-sm text-onBack text-center">
              1
            </td>
            <td className="w-1/3 border-b border-[#E0E0E0] px-2 py-3 body-sm text-onBack text-center font-semibold">
              Total
            </td>
            <td className="w-1/3 border-b border-[#E0E0E0] px-2 py-3 body-sm text-onBack text-center font-semibold">
              {formattedData.formattedTotal}
            </td>
          </tr>
        </tbody>
      </table>

      <p className="text-onBack body-sm mb-2">
        <strong className="text-primary">Nota:</strong> No vale como factura
        oficial
      </p>

      <p className="text-onBack subtitle-sm mb-2">
        <strong className="text-primary">Son:</strong>{' '}
        {formattedData.totalInWords}
      </p>

      <div className="mb-2 subtitle-sm flex space-x-10">
        <p className="text-onBack">
          <strong className="text-primary">Fecha:</strong> {formattedData.fecha}
        </p>
        <p className="text-onBack">
          <strong className="text-primary">Hora:</strong> {formattedData.hora}
        </p>
      </div>
    </>
  );
};
