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

  if (loading || !checked) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-primary">
        Verificando periodo de inscripción...
      </div>
    );
  }

  if (!isInscripcionActive()) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="font-bold text-error mb-4 text-2xl font-roboto">
          Inscripciones cerradas
        </h1>
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
