export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
  </div>
);

export const RegistrationPageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    <p className="text-lg text-primary">
      Verificando periodo de inscripción...
    </p>
  </div>
);

export const FormLoader = () => (
  <div className="flex items-center justify-center min-h-96">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);
