import { Button } from '@/components';
import { useNavigate } from 'react-router';
import { OlympiadInfo } from '@/interfaces/olympiad';
import {
  formatDate,
  getRegistrationStatus,
  getCurrentYear,
} from '@/utils/olympiad';
import { useFetchData } from '@/hooks/use-fetch-data';
import { PageLoader } from '@/components/ui/loadings';

export const Presentation = () => {
  const navigate = useNavigate();
  const { data, loading } = useFetchData<OlympiadInfo[]>(
    `/olympiads/${getCurrentYear()}`,
  );

  localStorage.setItem('userRole', 'user');

  const currentOlympiad = data && data.length > 0 ? data[0] : null;
  return (
    <main className="w-full flex flex-col items-center justify-center px-4 md:px-16 py-10 text-onBack">
      <section className="w-10/12 flex flex-col-reverse lg:flex-row items-center lg:space-x-10 mb-10 text-center ">
        <div>
          <h1 className="headline-lg text-primary mb-4">
            OLIMPIADA CIENTÍFICA NACIONAL
            <br /> SAN SIMÓN
          </h1>
          <p className="mb-6 text-md">
            El Comité de la Olimpiadas Científica Nacional San Simón O! SanSi, a
            través de la Facultad de Ciencias y Tecnología de la Universidad
            Mayor de San Simón, convoca a los estudiantes del Sistema de
            Educación Regular a participar en las Olimpiadas O! SanSi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-center">
            <Button
              label="Administrador"
              className="lg:w-40"
              onClick={() => {
                navigate('/login');
              }}
            />
            <Button
              label="Olimpista"
              className="lg:w-40"
              onClick={() => {
                localStorage.setItem('userRole', 'olympian');
                navigate('/olympian');
              }}
            />
          </div>
        </div>
        <img src="/assets/images/ohsansi2.png" className="mb-10 w-80" />
      </section>{' '}
      <section className="text-center mb-10 w-10/12">
        <h1 className="headline-lg text-primary mb-4">Inscripción</h1>
        <div className="flex flex-col items-start">
          {loading ? (
            <div className="w-full flex justify-center items-center h-36">
              <PageLoader />
            </div>
          ) : currentOlympiad ? (
            <>
              <p className="text-base mb-1">
                La fecha de inscripción inicia el{' '}
                <span className="text-red-500 font-semibold">
                  {formatDate(currentOlympiad.fecha_inicio)}
                </span>
              </p>
              <p className="text-base mb-1">
                La fecha de finalización de inscripción será hasta el{' '}
                <span className="text-red-500 font-semibold">
                  {formatDate(currentOlympiad.fecha_fin)}
                </span>
              </p>
              <p className="text-base mb-3">
                El costo de inscripción será de{' '}
                <span className="text-red-500 font-semibold">
                  {currentOlympiad.costo} (Bs)
                </span>{' '}
                por área
              </p>{' '}
              {(() => {
                if (!currentOlympiad) return null;
                const status = getRegistrationStatus(
                  currentOlympiad.fecha_inicio,
                  currentOlympiad.fecha_fin,
                );

                const statusColors = {
                  'not-started':
                    'text-yellow-600 bg-yellow-50 border-yellow-200',
                  active: 'text-success border-success bg-green-50',
                  ended: 'text-red-600 bg-red-50 border-red-200',
                } as const;

                return (
                  <div
                    className={`w-full p-3 rounded-lg border-2 ${statusColors[status.status]}`}
                  >
                    <p className="text-base font-semibold text-center">
                      {status.message}
                    </p>
                  </div>
                );
              })()}
            </>
          ) : (
            <p className="text-base mb-4">
              No se pudo cargar la información de la olimpiada.
            </p>
          )}
        </div>
      </section>
      <section className="text-center mb-10 w-10/12">
        <h1 className="headline-lg text-primary mb-4">Convocatoria</h1>
        <div className="flex flex-col items-center text-md">
          <p className="w-full text-start mb-4">
            Puedes descargar la convocatoria de la olimpiada.
          </p>
          <div className="w-full lg:w-fit md:w-fit">
            <Button
              className="w-full"
              label="Descargar Convocatoria"
              variantColor="variantDesactivate"
            />
          </div>
        </div>
      </section>
      <section className="text-center mb-10 w-10/12">
        <h1 className="headline-lg text-primary mb-4">Prerrequisitos</h1>
        <ol className="flex flex-col items-start list-decimal pl-4 space-y-2 text-md text-left">
          <li>
            Ser estudiante de nivel primaria o secundaria en el sistema de
            Educación Regular del Estado Plurinacional de Bolivia.
          </li>
          <li>Registrar un tutor o profesor.</li>
          <li>
            Registrarse en el formulario de inscripción para el(las) área(s) que
            se postula.
          </li>
          <li>
            Cumplir los requisitos específicos de la categoría de competencia en
            la que se inscribe.
          </li>
          <li>
            Tener su documento de identificación personal vigente (cédula de
            identidad) en el desarrollo de la competencia.
          </li>
          <li>Contar con correo electrónico personal o del tutor.</li>
        </ol>
      </section>
    </main>
  );
};
