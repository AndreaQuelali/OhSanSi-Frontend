import { Button } from '@/components';
import { OlympiadInfo } from '@/interfaces/olympiad';
import {
  formatDate,
  getRegistrationStatus,
  getCurrentYear,
} from '@/utils/olympiad';
import { useFetchData } from '@/hooks/use-fetch-data';
import { PageLoader } from '@/components/ui/loadings';
import { Header } from '../components/header';
import { CardArea } from '../components/card-area';
import { useEffect, useState } from 'react';
import { AlarmClockCheck, AlarmClockOff, CalendarX } from 'lucide-react';
import { Footer } from '../components/footer';

export const Presentation = () => {
  const { data, loading } = useFetchData<OlympiadInfo[]>(
    `/olympiads/${getCurrentYear()}/management`,
  );

  localStorage.setItem('userRole', 'user');
  const currentOlympiad = data?.[0] || null;
  const [areasUrl, setAreasUrl] = useState<string | null>(null);

  useEffect(() => {
    if (currentOlympiad) {
      setAreasUrl(`/olympiads/${currentOlympiad.olympiad_id}/levels-areas`);
    }
  }, [currentOlympiad]);

  const { data: areasData, loading: areasLoading } = useFetchData<{
    success: boolean;
    data: { year: number; areas: { area_id: number; area_name: string }[] };
  }>(areasUrl || '');

  const statusColors = {
    'not-started': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    active: 'text-green-600 bg-green-50 border-green-200',
    ended: 'text-red-600 bg-red-50 border-red-200',
  } as const;

  const icons = {
    'not-started': <AlarmClockOff className="w-5 h-5 animate-pulse" />,
    active: <AlarmClockCheck className="w-5 h-5 animate-bounce" />,
    ended: <CalendarX className="w-5 h-5" />,
  };

  const availableAreas = areasData?.data?.areas ?? [];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/docs/convocatoria_OhSansi.pdf';
    link.download = 'convocatoria_OhSansi.pdf';
    link.click();
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-start text-onBack bg-gradient-to-b from-white">
      <Header />
      <section className="text-center my-10 w-11/12 md:w-10/12 max-w-5xl">
        <h1 className="text-3xl headline-lg text-primary mb-4 tracking-wide">
          Inscripción
        </h1>
        <div className="bg-white shadow-md rounded-2xl px-6 py-6 text-left">
          {loading ? (
            <div className="w-full flex justify-center items-center h-36">
              <PageLoader />
            </div>
          ) : currentOlympiad ? (
            <>
              <p className="mb-2">
                La fecha de inscripción inicia el{' '}
                <span className="text-error body-lg">
                  {formatDate(currentOlympiad.start_date)}
                </span>
              </p>
              <p className="mb-2">
                Finaliza el{' '}
                <span className="text-error body-lg">
                  {formatDate(currentOlympiad.end_date)}
                </span>
              </p>
              <p className="mb-3">
                Costo de inscripción:{' '}
                <span className="text-error body-lg">
                  {currentOlympiad.cost} Bs
                </span>{' '}
                por área
              </p>
              {(() => {
                const status = getRegistrationStatus(
                  currentOlympiad.start_date,
                  currentOlympiad.end_date,
                );
                return (
                  <div
                    className={`w-full p-4 mt-4 rounded-xl border-2 flex items-center justify-center gap-3 shadow-sm transition-all duration-300 ${statusColors[status.status]}`}
                  >
                    {icons[status.status]}
                    <p className="subtitle-md">{status.message}</p>
                  </div>
                );
              })()}
            </>
          ) : (
            <p className="text-neutral">
              No se pudo cargar la información de la olimpiada.
            </p>
          )}
        </div>
      </section>

      {currentOlympiad && (
        <section className="text-center w-full py-16 px-6 md:px-20 bg-surface shadow-inner">
          <h2 className="text-3xl headline-lg text-primary mb-4">
            Áreas Disponibles
          </h2>
          <p className="body-lg text-onBack mb-8">
            Conoce las áreas que se encuentran disponibles en la olimpiada:
          </p>
          {areasLoading ? (
            <div className="w-full flex justify-center items-center h-36">
              <PageLoader />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableAreas.map((area) => (
                <CardArea key={area.area_id} areaName={area.area_name} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="flex flex-col justify-center text-center w-11/12 md:w-10/12 py-16 shadow-inner">
        <h2 className="text-3xl headline-lg text-primary mb-4">Convocatoria</h2>
        <p className="text-onBack mb-4 text-center body-lg">
          Puedes descargar la convocatoria de la olimpiada.
        </p>
        <div className="w-full md:w-fit flex justify-center mx-auto">
          <Button
            className="w-full flex justify-center gap-2"
            label="Descargar Convocatoria"
            onClick={handleDownload}
          />
        </div>
      </section>

      <section className="text-center w-full py-16 px-6 md:px-20 mb-10 bg-white shadow-inner">
        <h2 className="text-3xl headline-lg text-primary mb-4">
          Prerrequisitos
        </h2>
        <div className="bg-white shadow-md rounded-2xl px-6 py-6 text-left">
          <ol className="text-left body-lg list-decimal pl-6 space-y-2 text-onBack">
            <li>Ser estudiante de nivel primaria o secundaria en Bolivia.</li>
            <li>Registrar un tutor o profesor.</li>
            <li>
              Registrarse en el formulario para el(las) área(s) seleccionadas.
            </li>
            <li>Cumplir los requisitos de la categoría correspondiente.</li>
            <li>Tener su cédula de identidad vigente.</li>
            <li>Contar con correo electrónico personal o del tutor.</li>
          </ol>
        </div>
      </section>
      <section className="text-center w-full pb-10 mb-10 bg-white">
        <Footer />
      </section>
    </main>
  );
};
