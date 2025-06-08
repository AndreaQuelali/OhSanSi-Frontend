import { useOlimpiadaStore } from '@/store/use-olympiad-store';
import { useEffect, useState } from 'react';

interface RegistrationGuardProps {
  children: React.ReactNode;
}

const RegistrationGuard = ({ children }: RegistrationGuardProps) => {
  const { fetchOlimpiadas, isInscripcionActive, loading, olimpiadas } =
    useOlimpiadaStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (olimpiadas.length === 0) {
      fetchOlimpiadas().then(() => setChecked(true));
    } else {
      setChecked(true);
    }
  }, [fetchOlimpiadas, olimpiadas]);
  // Si está cargando o no se ha verificado, mostramos el loader
  if (loading || !checked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        <p className="text-lg text-primary">
          Verificando periodo de inscripción...
        </p>
      </div>
    );
  }

  if (!isInscripcionActive()) {
    return (
      <div className="flex flex-col justify-center items-center lg:mt-48 mt-20">
        <h1 className=" text-error mb-4 headline-lg">Inscripciones cerradas</h1>
        <p className="text-lg font-roboto">
          El periodo de inscripción para la olimpiada no está activo
          actualmente.
        </p>
        <p className="mt-4">
          <a href="/" className="text-primary hover:underline">
            Volver al inicio
          </a>
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RegistrationGuard;
