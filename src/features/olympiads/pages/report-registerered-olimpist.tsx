import { Button, Dropdown, Modal } from '@/components';
import IconPrint from '@/components/icons/icon-print';
import IconDownloadB from '@/components/icons/icon-downloadb';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FilterModal } from '../components/modals/modal-filter';
import { TableRegisterOli } from '../components/tables/table-report-olimpist';
import { useReportOlimpist } from '../hooks/use-report-olimpist';
import { REPORT_OLIMPIST_MESSAGES } from '../constants/report-olimpist-constants';
import type { FormData } from '../interfaces/report-olimpist';

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
  const selectedOlympiadId = watch('olympiad');

  const { data: olympiads } = useFetchData<{ id_olimpiada: number; gestion: number; nombre_olimpiada: string }[]>(`/olympiads`);
  const selectedOlympiad = olympiads?.find((o) => o.id_olimpiada === Number(selectedOlympiadId));
  const olympiadTitle = selectedOlympiad
    ? `${selectedOlympiad.gestion} - ${selectedOlympiad.nombre_olimpiada}`
    : REPORT_OLIMPIST_MESSAGES.NO_OLYMPIAD_SELECTED;

  const { data: areas } = useFetchData<{ id_area: number; nombre: string }[]>(`/areas`);
  const { data: levels } = useFetchData<{ niveles: { id_nivel: number; nombre: string }[] }>(`/levels`);
  const { data: grades } = useFetchData<{ id_grado: number; nombre_grado: string }[]>(`/grades`);
  const { data: departamentos } = useFetchData<{ id_departamento: number; nombre_departamento: string }[]>(`/departaments`);
  const { data: provincias } = useFetchData<{ id_provincia: number; nombre_provincia: string }[]>(`/provinces`);
  const { data: colegios } = useFetchData<{ id_colegio: number; nombre_colegio: string }[]>(`/schools/names`);

  const [tempSelectedAreas, setTempSelectedAreas] = useState<string[]>([]);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [tempLevels, setTempLevels] = useState<string[]>([]);
  const [showLevelsModal, setShowLevelsModal] = useState(false);
  const [tempGrades, setTempGrades] = useState<string[]>([]);
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [tempDepartamentos, setTempDepartamentos] = useState<string[]>([]);
  const [showDepartamentosModal, setShowDepartamentosModal] = useState(false);
  const [tempProvincias, setTempProvincias] = useState<string[]>([]);
  const [showProvinciasModal, setShowProvinciasModal] = useState(false);
  const [tempColegios, setTempColegios] = useState<string[]>([]);
  const [showColegiosModal, setShowColegiosModal] = useState(false);

  const {
    participants,
    originalParticipants,
    filters,
    setFilters,
    formatSelected,
    setFormatSelected,
    showModal,
    setShowModal,
    tableRef,
    currentDate,
    handlePrint,
    handleDownload,
  } = useReportOlimpist(selectedOlympiadId);

  const handleConfirmAreas = () => {
    setFilters((prev) => ({ ...prev, selectedAreas: tempSelectedAreas }));
    setShowAreaModal(false);
  };
  const confirmLevels = () => {
    setFilters((prev) => ({ ...prev, selectedLevels: tempLevels }));
    setShowLevelsModal(false);
  };
  const confirmGrades = () => {
    setFilters((prev) => ({ ...prev, selectedGrades: tempGrades }));
    setShowGradesModal(false);
  };
  const confirmDepartamentos = () => {
    setFilters((prev) => ({ ...prev, selectedDepartamentos: tempDepartamentos }));
    setShowDepartamentosModal(false);
  };
  const confirmProvincias = () => {
    setFilters((prev) => ({ ...prev, selectedProvincias: tempProvincias }));
    setShowProvinciasModal(false);
  };
  const confirmColegios = () => {
    setFilters((prev) => ({ ...prev, selectedColegios: tempColegios }));
    setShowColegiosModal(false);
  };

  return (
    <main className="w-full flex flex-col items-center">
      <div className="mx-5 mt-10 mb-32 md:w-11/12 ">
        <h1 className="text-primary headline-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center">
          {REPORT_OLIMPIST_MESSAGES.REPORT_TITLE}
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

          {selectedOlympiadId && originalParticipants.length !== 0 && (
            <div className="flex flex-wrap gap-4">
              <p className="body-lg text-primary">{REPORT_OLIMPIST_MESSAGES.FILTER_BY}</p>
              <Button
                onClick={() => {
                  setTempSelectedAreas(filters.selectedAreas);
                  setShowAreaModal(true);
                }}
                label="Área"
              />
              <Button
                label="Nivel"
                onClick={() => {
                  setTempLevels(filters.selectedLevels);
                  setShowLevelsModal(true);
                }}
              />
              <Button
                label="Grado"
                onClick={() => {
                  setTempGrades(filters.selectedGrades);
                  setShowGradesModal(true);
                }}
              />
              <Button
                label="Departamento"
                onClick={() => {
                  setTempDepartamentos(filters.selectedDepartamentos);
                  setShowDepartamentosModal(true);
                }}
              />
              <Button
                label="Provincia"
                onClick={() => {
                  setTempProvincias(filters.selectedProvincias);
                  setShowProvinciasModal(true);
                }}
              />
              <Button
                label="Unidad Educativa"
                onClick={() => {
                  setTempColegios(filters.selectedColegios);
                  setShowColegiosModal(true);
                }}
              />
            </div>
          )}
          <div className="flex justify-end gap-2 items-end">
            <Button
              variantColor={participants.length === 0 ? 'variant5' : 'variant4'}
              label={REPORT_OLIMPIST_MESSAGES.PRINT_LABEL}
              icon={IconPrint}
              onClick={() => handlePrint(olympiadTitle)}
              disabled={participants.length === 0}
            />
            <Button
              variantColor={participants.length === 0 ? 'variant5' : 'variant4'}
              label={REPORT_OLIMPIST_MESSAGES.DOWNLOAD_LABEL}
              icon={IconDownloadB}
              onClick={() => setShowModal(true)}
              disabled={participants.length === 0}
            />
          </div>
        </div>
        <div className="mt-2 mx-auto" ref={tableRef}>
          {originalParticipants.length > 0 ? (
            <TableRegisterOli data={participants} />
          ) : selectedOlympiadId ? (
            <p className="text-center py-4 text-neutral">
              {REPORT_OLIMPIST_MESSAGES.NO_PARTICIPANTS}
            </p>
          ) : (
            <p className="text-center py-4 text-neutral">
              {REPORT_OLIMPIST_MESSAGES.SELECT_OLYMPIAD}
            </p>
          )}
        </div>
      </div>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          text="Selecciona el formato de descarga"
          onConfirm={() => handleDownload(olympiadTitle)}
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
          options={areas || []}
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
