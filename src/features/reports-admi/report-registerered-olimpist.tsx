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
import axios from 'axios';
import { Departamento, Provincia, UnidadEducativa } from '../participants';

interface FormData {
  olympiad: string;
  area: string;
  level: string;
  depa: string;
  prov: string;
  colegio: string;
}

export const ReportRegisterOliPage = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      olympiad: '',
      area: '',
      level: '',
      depa: '',
      prov: '',
      colegio: '',
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

  //const [loadingLevels, setLoaodingLevels] = useState(false);

  const { data: departamentos, loading: loadingDepartamentos } =
    useFetchData<Departamento[]>('/departamentos');

  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(false);

  const [colegios, setColegios] = useState<UnidadEducativa[]>([]);
  const [loadingColegios, setLoadingColegios] = useState(false);

  const selectedDepartment = watch('depa');
  const selectedProv = watch('prov');

  useEffect(() => {
    if (selectedDepartment) {
      const fetchProvincias = async () => {
        setLoadingProvincias(true);
        try {
          const response = await axios.get(
            `${API_URL}/provincias/${selectedDepartment}`,
          );
          setProvincias(response.data);
        } catch (error) {
          console.error('Error al cargar las provincias:', error);
          setProvincias([]);
        } finally {
          setLoadingProvincias(false);
        }
      };

      fetchProvincias();
    } else {
      setProvincias([]);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedProv) {
      const fetchColegios = async () => {
        setLoadingColegios(true);
        try {
          const response = await axios.get(
            `${API_URL}/colegios/${selectedProv}`,
          );
          setColegios(response.data);
        } catch (error) {
          console.error('Error al cargar las unidades educativas:', error);
          setColegios([]);
        } finally {
          setLoadingColegios(false);
        }
      };

      fetchColegios();
    } else {
      setColegios([]);
    }
  }, [selectedProv]);

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

  const handleDepartamentoChange = (id_departamento: string) => {
    setValue('depa', id_departamento, { shouldValidate: true });
    setValue('prov', '');
    setValue('colegio', '');
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.depa = parseInt(id_departamento, 10);
    formData.prov = '';
    formData.colegio = '';
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

  const handleProvinciaChange = (id_provincia: string) => {
    setValue('prov', id_provincia, { shouldValidate: true });
    setValue('colegio', '');
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.prov = parseInt(id_provincia, 10);
    formData.colegio = '';
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

  const handleColegioChange = (id_colegio: string) => {
    setValue('colegio', id_colegio, { shouldValidate: true });
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.colegio = parseInt(id_colegio, 10);
    localStorage.setItem('participantData', JSON.stringify(formData));
  };

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
        <h1 className="text-primary headline-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center">
          Reporte de Olimpistas Inscritos
        </h1>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-9 mb-4">
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
            <Dropdown
              name="area"
              label="Área"
              className="w-full"
              placeholder="Seleccionar área"
              options={
                areas?.map((area) => ({
                  id: area.id_area.toString(),
                  name: area.nombre,
                })) || []
              }
              displayKey="name"
              valueKey="id"
              register={register}
              validationRules={{
                required: 'Debe seleccionar un área',
              }}
              errors={errors}
            />
            <Dropdown
              label="Nivel/Categoría"
              className="w-full"
              name="level"
              placeholder="Seleccionar nivel o categoría"
              options={
                levels?.niveles.map((level) => ({
                  id: level.id_nivel.toString(),
                  name: level.nombre,
                })) || []
              }
              displayKey="name"
              valueKey="id"
              register={register}
              validationRules={{
                required: 'Debe seleccionar un nivel o categoría',
              }}
              errors={errors}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-9 mb-4">
            <Dropdown
              label="Departamento"
              placeholder="Seleccionar departamento"
              className="w-ful"
              value={watch('depa') ?? ''}
              options={
                departamentos
                  ? departamentos.map((departamento) => ({
                      id: departamento.id_departamento.toString(),
                      name: departamento.nombre_departamento,
                    }))
                  : []
              }
              displayKey="name"
              valueKey="id"
              register={register}
              {...register('depa', {
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleDepartamentoChange(e.target.value),
              })}
              disabled={loadingDepartamentos}
              errors={errors}
            />
            <div>
              <Dropdown
                label="Provincia"
                placeholder="Seleccionar provincia"
                className="w-full"
                value={watch('prov') ?? ''}
                options={
                  provincias
                    ? provincias.map((provincia) => ({
                        id: provincia.id_provincia.toString(),
                        name: provincia.nombre_provincia,
                      }))
                    : []
                }
                displayKey="name"
                valueKey="id"
                register={register}
                {...register('prov', {
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleProvinciaChange(e.target.value),
                })}
                disabled={loadingProvincias}
                errors={errors}
              />
              <div>
                {!selectedDepartment && (
                  <span className="text-neutral subtitle-sm">
                    Primero seleccione un departamento.
                  </span>
                )}
              </div>
            </div>
            <div>
              <Dropdown
                label="Unidad educativa"
                placeholder="Seleccionar unidad educativa"
                className="w-full"
                value={watch('colegio') ?? ''}
                options={
                  colegios
                    ? colegios.map((colegio) => ({
                        id: colegio.id_colegio.toString(),
                        name: colegio.nombre_colegio,
                      }))
                    : []
                }
                displayKey="name"
                valueKey="id"
                register={register}
                {...register('colegio', {
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleColegioChange(e.target.value),
                })}
                disabled={loadingColegios}
                errors={errors}
              />
              <div>
                {!selectedProv && (
                  <span className="text-neutral subtitle-sm">
                    Primero seleccione una provincia.
                  </span>
                )}
              </div>
            </div>
          </div>

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
    </main>
  );
};
