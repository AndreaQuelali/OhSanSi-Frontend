import { Button } from '@/components';
import { useNavigate } from 'react-router';
import { useFetchData } from '@/hooks/use-fetch-data';
import { OlympiadInfo, OlympiadStatistics } from '@/interfaces/olympiad';
import { getCurrentYear } from '@/utils/olympiad';
import { PageLoader } from '@/components/ui/loadings';
import CardTotal from '../components/card-total';
import { CardPaso } from '../components/card-step';
import IconStep1 from '@/components/icons/icon-step1';
import IconStep2 from '@/components/icons/icon-step2';
import IconStep3 from '@/components/icons/icon-step3';
import IconStep4 from '@/components/icons/icon-step4';
import IconStep5 from '@/components/icons/icon-step5';
import IconStep6 from '@/components/icons/icon-step6';
import IconArrow from '@/components/icons/icon-arrow';

export const Home = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const { data: olympiadData, loading: olympiadLoading } = useFetchData<
    OlympiadInfo[]
  >(`/olympiads/${getCurrentYear()}`);
  const currentOlympiad =
    olympiadData && olympiadData.length > 0 ? olympiadData[0] : null;

  const isRegistrationOpen = !!currentOlympiad;
  const registrationStatus = isRegistrationOpen ? 'ABIERTA' : 'CERRADA';
  const statusColors = isRegistrationOpen
    ? 'border-success bg-green-50'
    : 'border-yellow-500 bg-yellow-50';
  const badgeColors = isRegistrationOpen
    ? 'bg-success text-white'
    : 'bg-yellow-500 text-white';
  const { data: statisticsData, loading: statisticsLoading } =
    useFetchData<OlympiadStatistics>(
      currentOlympiad
        ? `/olympiads/${currentOlympiad.olympiad_id}/statistics`
        : '',
    );

  return (
    <main className="w-full flex flex-col items-center justify-center px-4 md:px-16 py-10 text-onBack">
      {olympiadLoading && <PageLoader />}
      {!olympiadLoading && userRole === 'olympian' && (
        <section className="mb-14 w-11/12">
          <h1 className="headline-lg text-primary mb-6 text-center">
            Pasos de Inscripción
          </h1>

          <h2 className="headline-sm text-secondary mb-4 text-left">
            Inscripción Individual
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 mb-10">
            <CardPaso
              Icon={<IconStep1 />}
              text="¿Eres padre/madre o profesor del olimpista? Regístrate como tutor, sino salta este paso."
              route="/olympian/register-tutor"
            />
            <div className="md:mt-20 mt-0 rotate-90 md:rotate-0">
              <IconArrow />
            </div>
            <CardPaso
              Icon={<IconStep2 />}
              text="Registra los datos personales y académicos del olimpista."
              route="/olympian/register-olympians"
            />

            <div className="md:mt-20 mt-0 rotate-90 md:rotate-0">
              <IconArrow />
            </div>
            <CardPaso
              Icon={<IconStep3 />}
              text="Registra las áreas en las que el olimpista desea participar."
              route="/olympian/register-selected-areas"
            />

            <div className="md:mt-20 mt-0 rotate-90 md:rotate-0">
              <IconArrow />
            </div>
            <CardPaso
              Icon={<IconStep4 />}
              text="Genera la boleta de orden de pago del registro del olimpista."
              route="/olympian/generate-order-payment"
            />

            <div className="md:mt-20 mt-0 rotate-90 md:rotate-0">
              <IconArrow />
            </div>
            <CardPaso
              Icon={<IconStep5 />}
              text="Finaliza la inscripción subiendo el comprobante de pago."
              route="/olympian/upload-payment"
            />
          </div>

          <h2 className="headline-sm text-secondary mb-4 text-left">
            Inscripción por Lista
          </h2>

          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 mb-10">
            <CardPaso
              Icon={<IconStep6 />}
              text="Registra varios olimpistas a través de un archivo Excel."
              route="/olympian/register-data-excel"
            />

            <div className="md:mt-20 mt-0 rotate-90 md:rotate-0">
              <IconArrow />
            </div>
            <CardPaso
              Icon={<IconStep4 />}
              text="Genera la boleta de orden de pago del registro del olimpista."
              route="/olympian/generate-order-payment"
            />

            <div className="md:mt-20 mt-0 rotate-90 md:rotate-0">
              <IconArrow />
            </div>
            <CardPaso
              Icon={<IconStep5 />}
              text="Finaliza la inscripción subiendo el comprobante de pago."
              route="/olympian/upload-payment"
            />
          </div>
        </section>
      )}
      {!olympiadLoading && userRole === 'admin' && (
        <section className=" max-w-6xl mb-14 w-10/12">
          <h1 className="headline-lg text-primary mb-4">Hola, Admi</h1>
          <p className="body-lg text-neutral mb-6">
            Bienvenido al sistema de administración de olimpiadas
          </p>{' '}
          <div
            className={`flex flex-col mb-6 md:flex-row items-center justify-between border-2 ${statusColors} rounded-xl p-4 bg-white shadow-sm`}
          >
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-onBack">
                Estado de la Olimpiada
              </h3>
              <p className="text-sm text-neutral">
                {isRegistrationOpen
                  ? 'Las inscripciones están activas'
                  : 'No hay olimpiadas activas para este año'}
              </p>
            </div>
            <span
              className={`mt-4 md:mt-0 px-5 py-1 rounded-full ${badgeColors} font-semibold text-sm`}
            >
              {registrationStatus}
            </span>
          </div>{' '}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-32 mb-6">
            {!currentOlympiad ? (
              <div className="text-center w-full">
                <p className="text-neutral text-lg">
                  No hay olimpiadas activas para mostrar estadísticas
                </p>
              </div>
            ) : statisticsLoading ? (
              <p>Cargando estadísticas...</p>
            ) : (
              <>
                <CardTotal
                  title="Total Participantes"
                  value={statisticsData?.total_inscritos || 0}
                  subtitle="Inscritos actualmente"
                />
                <CardTotal
                  title="Total de Áreas"
                  value={statisticsData?.total_areas || 0}
                  subtitle="Áreas disponibles"
                />
                <CardTotal
                  title="Total de Niveles"
                  value={statisticsData?.total_niveles || 0}
                  subtitle="Niveles disponibles"
                />
              </>
            )}
          </div>
          <h3 className="headline-sm text-primary mb-6">Accesos rápidos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: 'Registrar Nueva Olimpiada',
                path: '/administrator/register-info',
              },
              {
                label: 'Registrar Áreas',
                path: '/administrator/register-areas',
              },
              {
                label: 'Registrar Niveles',
                path: '/administrator/register-levels',
              },
              {
                label: 'Asociación Niveles con Grados',
                path: '/administrator/register-levels-grades',
              },
              {
                label: 'Registro Niveles en Área',
                path: '/administrator/register-levels-area',
              },
              {
                label: 'Reporte de Olimpistas',
                path: '/administrator/report-registered-olimpist',
              },
            ].map((item, index) => (
              <Button
                key={`admin-button-${index}`}
                onClick={() => {
                  console.log('Navigating to:', item.path);
                  navigate(item.path);
                }}
                label={item.label}
                className="w-full"
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
