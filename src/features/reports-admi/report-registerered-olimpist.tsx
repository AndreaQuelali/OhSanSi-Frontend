import { Button, Dropdown, Modal } from '@/components';
import { TableRegisterOli } from './components/table-report-olimpist';
import IconPrint from '@/components/icons/icon-print';
import IconDownloadB from '@/components/icons/icon-downloadb';
import { useFetchData } from '@/hooks/use-fetch-data';
import { API_URL } from '@/config/api-config';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { Format } from 'react-data-table-component/dist/DataTable/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface FormData {
  olympiad: string;
}

export const ReportRegisterOliPage = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      olympiad: '',
    },
  });
  const [participants, setParticipants] = useState<typeof data>([]);
  const [showModal, setShowModal] = useState(false);
  const [formatSelected, setFormatSelected] = useState<Format>('pdf');
  const tableRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date().toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const selectedOlympiadId = watch('olympiad');
  const { data: olympiads } = useFetchData<
    { id_olimpiada: number; gestion: number; nombre_olimpiada: string }[]
  >(`${API_URL}/olimpiadas`);

  const selectedOlympiad = olympiads?.find(
    (o) => o.id_olimpiada === Number(selectedOlympiadId),
  );
  const olympiadTitle = selectedOlympiad
    ? `${selectedOlympiad.gestion} - ${selectedOlympiad.nombre_olimpiada}`
    : 'Olimpiada no seleccionada';

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!selectedOlympiadId) return;

      try {
        const response = await fetch(
          `${API_URL}/olimpistas-inscritos/${selectedOlympiadId}`,
        );
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const formattedData = result.data.map((item: any) => ({
            Apellido: item.apellidos,
            Nombre: item.nombres,
            CI: item.ci.toString(),
            Departamento: item.departamento,
            Provincia: item.provincia,
            UnidadEducativa: item.colegio,
            Grado: item.grado,
            Area: item.area,
            NivelCategoria: item.nivel,
          }));

          setParticipants(formattedData);
        } else {
          setParticipants([]);
        }
      } catch (error) {
        console.error('Error al obtener olimpistas inscritos:', error);
        setParticipants([]);
      }
    };

    fetchParticipants();
  }, [selectedOlympiadId]);

  const handlePrint = () => {
    if (!participants.length) return;

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Universidad Mayor de San Simón', 15, 12); // Izquierda (x=15)
    doc.text('Olimpiadas Oh!SanSi', 195, 12, { align: 'right' }); // Derecha (x=195)

    doc.setFontSize(16);
    doc.text('Reporte de Olimpistas Inscritos', 105, 20, { align: 'center' });
    doc.setFontSize(12);

    doc.text(olympiadTitle, 105, 28, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Fecha: ${currentDate}`, 105, 36, { align: 'center' });

    const columns = [
      'Apellido(s)',
      'Nombre(s)',
      'CI',
      'Departamento',
      'Provincia',
      'Unidad Educativa',
      'Grado',
      'Área',
      'Nivel',
    ];

    const rows = participants.map((row) => [
      row.Apellido,
      row.Nombre,
      row.CI,
      row.Departamento,
      row.Provincia,
      row.UnidadEducativa,
      row.Grado,
      row.Area,
      row.NivelCategoria,
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 44,
      styles: { fontSize: 8 },
    });

    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  /*
  const handlePrint = () => {
    if (!participants || participants.length === 0) {
      alert('No hay datos para imprimir.');
      return;
    }

    const olympiadTitle = selectedOlympiad
      ? `${selectedOlympiad.gestion} - ${selectedOlympiad.nombre_olimpiada}`
      : 'Olimpiada no seleccionada';

    const printWindow = window.open('', '', 'width=900,height=650');
    if (!printWindow) return;

    const tableHTML = `
      <html>
      <head>
        <title>Reporte de Olimpistas Inscritos</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h2 {
            text-align: center;
            margin-bottom: 5px;
          }
          h3 {
            text-align: center;
            margin-bottom: 20px;
            font-weight: normal;
            font-size: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-size: 12px;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
      <h2>Universidad Mayor de San Simón</h2>
        <h2>Reporte de Olimpistas Inscritos</h2>
        <h3>${olympiadTitle}</h3>
        <h3>Fecha: ${currentDate}</h3>
        <table>
          <thead>
            <tr>
              <th>Apellido(s)</th>
              <th>Nombre(s)</th>
              <th>CI</th>
              <th>Departamento</th>
              <th>Provincia</th>
              <th>Unidad Educativa</th>
              <th>Grado</th>
              <th>Área</th>
              <th>Nivel</th>
            </tr>
          </thead>
          <tbody>
            ${participants
              .map(
                (row) => `
              <tr>
                <td>${row.Apellido}</td>
                <td>${row.Nombre}</td>
                <td>${row.CI}</td>
                <td>${row.Departamento}</td>
                <td>${row.Provincia}</td>
                <td>${row.UnidadEducativa}</td>
                <td>${row.Grado}</td>
                <td>${row.Area}</td>
                <td>${row.NivelCategoria}</td>
              </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };*/

  const handleDownload = () => {
    if (formatSelected === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text('Universidad Mayor de San Simón', 15, 12); // Izquierda (x=15)
      doc.text('Olimpiadas Oh!SanSi', 195, 12, { align: 'right' }); // Derecha (x=195)

      doc.setFontSize(16);
      doc.text('Reporte de Olimpistas Inscritos', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(olympiadTitle, 105, 28, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Fecha: ${currentDate}`, 105, 36, { align: 'center' });

      const columns = [
        'Apellido(s)',
        'Nombre(s)',
        'CI',
        'Departamento',
        'Provincia',
        'Unidad Educativa',
        'Grado',
        'Área',
        'Nivel',
      ];

      const rows = participants.map((row) => [
        row.Apellido,
        row.Nombre,
        row.CI,
        row.Departamento,
        row.Provincia,
        row.UnidadEducativa,
        row.Grado,
        row.Area,
        row.NivelCategoria,
      ]);

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 44,
        styles: { fontSize: 8 },
      });

      doc.save('reporte_olimpistas_inscritos.pdf');
    } else if (formatSelected === 'excel') {
      const headerRows = [
        ['Universidad Mayor de San Simón'],
        ['Reporte de Olimpistas Inscritos'],
        [olympiadTitle],
        [`Fecha: ${currentDate}`],
        [],
        [
          'Apellido(s)',
          'Nombre(s)',
          'CI',
          'Departamento',
          'Provincia',
          'Unidad Educativa',
          'Grado',
          'Área',
          'Nivel',
        ],
      ];

      const dataRows = participants.map((row) => [
        row.Apellido,
        row.Nombre,
        row.CI,
        row.Departamento,
        row.Provincia,
        row.UnidadEducativa,
        row.Grado,
        row.Area,
        row.NivelCategoria,
      ]);

      const allRows = [...headerRows, ...dataRows];
      const worksheet = XLSX.utils.aoa_to_sheet(allRows);
      const boldCells = [
        'A1',
        'A2',
        'A3',
        'A5',
        'B5',
        'C5',
        'D5',
        'E5',
        'F5',
        'G5',
        'H5',
        'I5',
      ];
      boldCells.forEach((cell) => {
        if (!worksheet[cell]) return;
        worksheet[cell].s = {
          font: { bold: true },
        };
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        cellStyles: true,
      });

      const blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      saveAs(blob, 'reporte_olimpistas_inscritos.xlsx');
    }

    setShowModal(false);
  };

  return (
    <main className="w-full flex flex-col items-center">
      <div className="mx-5 mt-10 mb-32 md:w-11/12 ">
        <h2 className="headline-lg text-primary text-center mb-4">
          Reporte de Olimpistas Inscritos
        </h2>
        <div className="w-full flex justify-between items-center gap-2">
          <Dropdown
            name="olympiad"
            label="Olimpiada"
            placeholder="Seleccionar olimpiada"
            className="w-full"
            options={
              olympiads?.map((olimpiada) => ({
                id: olimpiada.id_olimpiada.toString(),
                name: `${olimpiada.gestion} - ${olimpiada.nombre_olimpiada}`,
              })) || []
            }
            displayKey="name"
            valueKey="id"
            register={register}
            errors={errors}
            validationRules={{
              required: 'Debe seleccionar un año/gestión',
            }}
          />
          <div className="flex justify-end gap-2 items-end">
            <Button
              variantColor="variant4"
              label="Imprimir"
              icon={IconPrint}
              onClick={handlePrint}
            />
            <Button
              variantColor="variant4"
              label="Descargar"
              icon={IconDownloadB}
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
        <div className="mt-2 md:w-11/12 mx-auto" ref={tableRef}>
          {participants.length > 0 ? (
            <TableRegisterOli data={participants} />
          ) : selectedOlympiadId ? (
            <p className="text-center py-4 text-neutral">
              No hay olimpistas inscritos en esta olimpiada
            </p>
          ) : (
            <p className="text-center py-4 text-neutral">
              Seleccione una olimpiada para ver datos
            </p>
          )}
        </div>
      </div>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          text="Selecciona el formato de descarga"
          onConfirm={handleDownload}
        >
          <div className="flex flex-col gap-2 px-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="format"
                value="pdf"
                checked={formatSelected === 'pdf'}
                onChange={() => setFormatSelected('pdf')}
              />
              PDF
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="format"
                value="excel"
                checked={formatSelected === 'excel'}
                onChange={() => setFormatSelected('excel')}
              />
              Excel
            </label>
          </div>
        </Modal>
      )}
    </main>
  );
};
