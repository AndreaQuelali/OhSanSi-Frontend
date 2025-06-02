import { Button, Dropdown, Modal } from '@/components';
import { TableRegisterOli } from '../components/table-report-olimpist';
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
import { FilterModal } from '../components/modal-filter';

interface FormData {
  olympiad: string;
  area: string;
  level: string;
  grade: string;
  depa: string;
  prov: string;
  colegio: string;
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
      area: '',
      level: '',
      grade: '',
      depa: '',
      prov: '',
      colegio: '',
    },
  });
  const [participants, setParticipants] = useState<typeof data>([]);
  const [originalParticipants, setOriginalParticipants] = useState<typeof data>(
    [],
  );

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
  //const [loadingOli, setLoadingOli] = useState(false);

  const selectedOlympiad = olympiads?.find(
    (o) => o.id_olimpiada === Number(selectedOlympiadId),
  );
  const olympiadTitle = selectedOlympiad
    ? `${selectedOlympiad.gestion} - ${selectedOlympiad.nombre_olimpiada}`
    : 'Olimpiada no seleccionada';

  const { data: areas } = useFetchData<{ id_area: number; nombre: string }[]>(
    `${API_URL}/areas`,
  );

  //const [loadingAreas, setLoadingAreas] = useState(false);

  const { data: levels } = useFetchData<{
    niveles: { id_nivel: number; nombre: string }[];
  }>(`${API_URL}/get-niveles`);

  const { data: grades } = useFetchData<
    {
      id_grado: number;
      nombre_grado: string;
    }[]
  >(`${API_URL}/grados`);

  //const [loadingLevels, setLoaodingLevels] = useState(false);

  const { data: departamentos } = useFetchData<
    {
      id_departamento: number;
      nombre_departamento: string;
    }[]
  >(`${API_URL}/departamentos`);

  const { data: provincias } = useFetchData<
    {
      id_provincia: number;
      nombre_provincia: string;
    }[]
  >(`${API_URL}/provincias`);

  const { data: colegios } = useFetchData<
    {
      id_colegio: number;
      nombre_colegio: string;
    }[]
  >(`${API_URL}/colegios/nombres`);

  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [tempSelectedAreas, setTempSelectedAreas] = useState<string[]>([]);

  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [tempLevels, setTempLevels] = useState<string[]>([]);
  const [showLevelsModal, setShowLevelsModal] = useState(false);

  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [tempGrades, setTempGrades] = useState<string[]>([]);
  const [showGradesModal, setShowGradesModal] = useState(false);

  const [selectedDepartamentos, setSelectedDepartamentos] = useState<string[]>(
    [],
  );
  const [tempDepartamentos, setTempDepartamentos] = useState<string[]>([]);
  const [showDepartamentosModal, setShowDepartamentosModal] = useState(false);

  const [selectedProvincias, setSelectedProvincias] = useState<string[]>([]);
  const [tempProvincias, setTempProvincias] = useState<string[]>([]);
  const [showProvinciasModal, setShowProvinciasModal] = useState(false);

  const [selectedColegios, setSelectedColegios] = useState<string[]>([]);
  const [tempColegios, setTempColegios] = useState<string[]>([]);
  const [showColegiosModal, setShowColegiosModal] = useState(false);

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
            Departamento: item.departamento,
            Provincia: item.provincia,
            UnidadEducativa: item.colegio,
            Grado: item.grado,
            Area: item.area,
            NivelCategoria: item.nivel,
          }));

          setOriginalParticipants(formattedData);
          setParticipants(formattedData);
        } else {
          setOriginalParticipants([]);
          setParticipants([]);
        }
      } catch (error) {
        console.error('Error al obtener olimpistas inscritos:', error);
        setOriginalParticipants([]);
        setParticipants([]);
      }
    };

    fetchParticipants();
  }, [selectedOlympiadId]);

  useEffect(() => {
    let filtered = [...originalParticipants];

    if (selectedDepartamentos.length > 0) {
      filtered = filtered.filter((p) =>
        selectedDepartamentos.includes(p.Departamento),
      );
    }

    if (selectedAreas.length > 0) {
      filtered = filtered.filter((p) => selectedAreas.includes(p.Area));
    }

    if (selectedLevels.length > 0) {
      filtered = filtered.filter((p) =>
        selectedLevels.includes(p.NivelCategoria),
      );
    }

    if (selectedGrades.length > 0) {
      filtered = filtered.filter((p) => selectedGrades.includes(p.Grado));
    }

    if (selectedProvincias.length > 0) {
      filtered = filtered.filter((p) =>
        selectedProvincias.includes(p.Provincia),
      );
    }

    if (selectedColegios.length > 0) {
      filtered = filtered.filter((p) =>
        selectedColegios.includes(p.UnidadEducativa),
      );
    }

    setParticipants(filtered);
  }, [
    selectedDepartamentos,
    selectedAreas,
    selectedLevels,
    selectedGrades,
    selectedProvincias,
    selectedColegios,
    originalParticipants,
  ]);

  const handlePrint = () => {
    if (!participants.length) return;

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Universidad Mayor de San Simón', 15, 12); // Izquierda
    doc.text('Olimpiadas Oh!SanSi', 195, 12, { align: 'right' }); // Derecha

    doc.setFontSize(16);
    doc.text('Reporte de Olimpistas Inscritos', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(olympiadTitle, 105, 28, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Fecha: ${currentDate}`, 105, 36, { align: 'center' });

    const filtersSummary: string[] = [];

    if (selectedAreas.length > 0)
      filtersSummary.push(`Área(s): ${selectedAreas.join(' - ')}`);
    if (selectedLevels.length > 0)
      filtersSummary.push(`Nivel(es): ${selectedLevels.join(' - ')}`);
    if (selectedGrades.length > 0)
      filtersSummary.push(`Grado(s): ${selectedGrades.join(' - ')}`);
    if (selectedDepartamentos.length > 0)
      filtersSummary.push(
        `Departamento(s): ${selectedDepartamentos.join(' - ')}`,
      );
    if (selectedProvincias.length > 0)
      filtersSummary.push(`Provincia(s): ${selectedProvincias.join(' - ')}`);
    if (selectedColegios.length > 0)
      filtersSummary.push(
        `Unidad(es) Educativa(s): ${selectedColegios.join(' - ')}`,
      );

    let currentY = 44;

    filtersSummary.forEach((line) => {
      doc.text(line, 15, currentY);
      currentY += 6;
    });

    const columns = [
      'Apellido(s)',
      'Nombre(s)',
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
      startY: currentY + 2,
      styles: {
        fontSize: 8,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
      },
      headStyles: {
        fillColor: [38, 50, 108],
        textColor: [255, 255, 255],
        halign: 'center',
        valign: 'middle',
      },
    });

    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  const handleDownload = () => {
    const getFiltersSummary = () => {
      const summary = [];

      if (selectedAreas.length > 0)
        summary.push(`Área(s): ${selectedAreas.join(' - ')}`);
      if (selectedLevels.length > 0)
        summary.push(`Nivel(es): ${selectedLevels.join(' - ')}`);
      if (selectedGrades.length > 0)
        summary.push(`Grado(s): ${selectedGrades.join(' - ')}`);
      if (selectedDepartamentos.length > 0)
        summary.push(`Departamento(s): ${selectedDepartamentos.join(' - ')}`);
      if (selectedProvincias.length > 0)
        summary.push(`Provincia(s): ${selectedProvincias.join(' - ')}`);
      if (selectedColegios.length > 0)
        summary.push(
          `Unidad(es) Educativa(s): ${selectedColegios.join(' - ')}`,
        );

      return summary;
    };

    const filtersSummary = getFiltersSummary();

    if (formatSelected === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text('Universidad Mayor de San Simón', 15, 12);
      doc.text('Olimpiadas Oh!SanSi', 195, 12, { align: 'right' });

      doc.setFontSize(16);
      doc.text('Reporte de Olimpistas Inscritos', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(olympiadTitle, 105, 28, { align: 'center' });

      doc.setFontSize(10);
      doc.text(`Fecha: ${currentDate}`, 105, 36, { align: 'center' });

      let y = 44;
      filtersSummary.forEach((line) => {
        doc.text(line, 15, y);
        y += 6;
      });

      const columns = [
        'Apellido(s)',
        'Nombre(s)',
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
        startY: y + 2,
        styles: {
          fontSize: 8,
          textColor: [0, 0, 0],
          fillColor: [255, 255, 255],
        },
        headStyles: {
          fillColor: [38, 50, 108],
          textColor: [255, 255, 255],
          halign: 'center',
          valign: 'middle',
        },
      });

      doc.save('reporte_olimpistas_inscritos.pdf');
    } else if (formatSelected === 'excel') {
      const headerRows = [
        ['Universidad Mayor de San Simón'],
        ['Reporte de Olimpistas Inscritos'],
        [olympiadTitle],
        [`Fecha: ${currentDate}`],
      ];

      filtersSummary.forEach((line) => {
        headerRows.push([line]);
      });

      headerRows.push([]);

      const columnTitles = [
        'Apellido(s)',
        'Nombre(s)',
        'Departamento',
        'Provincia',
        'Unidad Educativa',
        'Grado',
        'Área',
        'Nivel',
      ];

      headerRows.push(columnTitles);

      const dataRows = participants.map((row) => [
        row.Apellido,
        row.Nombre,
        row.Departamento,
        row.Provincia,
        row.UnidadEducativa,
        row.Grado,
        row.Area,
        row.NivelCategoria,
      ]);

      const allRows = [...headerRows, ...dataRows];
      const worksheet = XLSX.utils.aoa_to_sheet(allRows);

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

  const handleConfirmAreas = () => {
    setSelectedAreas(tempSelectedAreas);
    setShowAreaModal(false);
  };

  const confirmLevels = () => {
    setSelectedLevels(tempLevels);
    setShowLevelsModal(false);
  };

  const confirmGrades = () => {
    setSelectedGrades(tempGrades);
    setShowGradesModal(false);
  };

  const confirmDepartamentos = () => {
    setSelectedDepartamentos(tempDepartamentos);
    setShowDepartamentosModal(false);
  };

  const confirmProvincias = () => {
    setSelectedProvincias(tempProvincias);
    setShowProvinciasModal(false);
  };

  const confirmColegios = () => {
    setSelectedColegios(tempColegios);
    setShowColegiosModal(false);
  };
  return (
    <main className="w-full flex flex-col items-center">
      <div className="mx-5 mt-10 mb-32 md:w-11/12 ">
        <h1 className="text-primary headline-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center">
          Reporte de Olimpistas Inscritos
        </h1>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-9 mb-4">
            <Dropdown
              name="olympiad"
              label="Olimpiada"
              placeholder="Seleccionar olimpiada"
              value={watch('olympiad') ?? ''}
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
          </div>

          {selectedOlympiadId && (
            <div className="flex flex-wrap gap-4">
              <p className="body-lg text-primary">Filtrar por: </p>
              <Button
                onClick={() => {
                  setTempSelectedAreas(selectedAreas);
                  setShowAreaModal(true);
                }}
                label="Área"
              />
              <Button
                label="Nivel"
                onClick={() => {
                  setTempLevels(selectedLevels);
                  setShowLevelsModal(true);
                }}
              />

              <Button
                label="Grado"
                onClick={() => {
                  setTempGrades(selectedGrades);
                  setShowGradesModal(true);
                }}
              />

              <Button
                label="Departamento"
                onClick={() => {
                  setTempDepartamentos(selectedDepartamentos);
                  setShowDepartamentosModal(true);
                }}
              />

              <Button
                label="Provincia"
                onClick={() => {
                  setTempProvincias(selectedProvincias);
                  setShowProvinciasModal(true);
                }}
              />

              <Button
                label="Unidad Educativa"
                onClick={() => {
                  setTempColegios(selectedColegios);
                  setShowColegiosModal(true);
                }}
              />
            </div>
          )}
          <div className="flex justify-end gap-2 items-end">
            <Button
              variantColor={participants.length === 0 ? 'variant5' : 'variant4'}
              label="Imprimir"
              icon={IconPrint}
              onClick={handlePrint}
            />
            <Button
              variantColor={participants.length === 0 ? 'variant5' : 'variant4'}
              label="Descargar"
              icon={IconDownloadB}
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
        <div className="mt-2 mx-auto" ref={tableRef}>
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
      {showAreaModal && (
        <FilterModal
          label="Filtrar por área"
          options={areas}
          valueKey="nombre"
          labelKey="nombre"
          selectedValues={tempSelectedAreas}
          onChange={setTempSelectedAreas}
          onClose={() => setShowAreaModal(false)}
          onConfirm={handleConfirmAreas}
        />
      )}
      {showLevelsModal && (
        <FilterModal
          label="Filtrar por Nivel"
          options={levels?.niveles ?? []}
          valueKey="nombre"
          labelKey="nombre"
          selectedValues={tempLevels}
          onChange={setTempLevels}
          onClose={() => setShowLevelsModal(false)}
          onConfirm={confirmLevels}
        />
      )}

      {showGradesModal && (
        <FilterModal
          label="Filtrar por Grado"
          options={grades ?? []}
          valueKey="nombre_grado"
          labelKey="nombre_grado"
          selectedValues={tempGrades}
          onChange={setTempGrades}
          onClose={() => setShowGradesModal(false)}
          onConfirm={confirmGrades}
        />
      )}

      {showDepartamentosModal && (
        <FilterModal
          label="Filtrar por Departamento"
          options={departamentos ?? []}
          valueKey="nombre_departamento"
          labelKey="nombre_departamento"
          selectedValues={tempDepartamentos}
          onChange={setTempDepartamentos}
          onClose={() => setShowDepartamentosModal(false)}
          onConfirm={confirmDepartamentos}
        />
      )}

      {showProvinciasModal && (
        <FilterModal
          label="Filtrar por Provincia"
          options={provincias ?? []}
          valueKey="nombre_provincia"
          labelKey="nombre_provincia"
          selectedValues={tempProvincias}
          onChange={setTempProvincias}
          onClose={() => setShowProvinciasModal(false)}
          onConfirm={confirmProvincias}
        />
      )}

      {showColegiosModal && (
        <FilterModal
          label="Filtrar por Unidad Educativa"
          options={colegios ?? []}
          valueKey="nombre_colegio"
          labelKey="nombre_colegio"
          selectedValues={tempColegios}
          onChange={setTempColegios}
          onClose={() => setShowColegiosModal(false)}
          onConfirm={confirmColegios}
        />
      )}
    </main>
  );
};
