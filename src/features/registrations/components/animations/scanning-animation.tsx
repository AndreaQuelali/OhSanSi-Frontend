export const ScanningAnimation = () => (
  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-md flex items-center justify-center">
    <div className="relative w-full h-full">
      <div className="absolute inset-0 border-2 border-blue-500 rounded-md opacity-50"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse"></div>
      <div
        className="absolute left-0 right-0 h-0.5 bg-blue-400 animate-bounce"
        style={{
          animation: 'scan 2s ease-in-out infinite',
        }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg">
          <p className="text-sm font-medium text-blue-600">
            Verificando pago...
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const SuccessAnimation = ({ message }: { message: string }) => (
  <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-md flex flex-col items-center justify-center">
    <div className="bg-white rounded-full p-4 mb-4 shadow-lg animate-bounce">
      <svg
        className="w-12 h-12 text-green-500 animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
    <div className="bg-white bg-opacity-95 px-4 py-2 rounded-lg max-w-xs text-center">
      <p className="text-sm font-medium text-green-700">{message}</p>
    </div>
  </div>
);

export const ErrorAnimation = ({
  message,
  errors,
  onRetry,
}: {
  message: string;
  errors?: string[];
  onRetry?: () => void;
}) => (
  <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-md flex flex-col items-center justify-center">
    <div className="bg-white rounded-full p-4 mb-4 shadow-lg animate-pulse">
      <svg
        className="w-12 h-12 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
    <div className="bg-white bg-opacity-95 px-4 py-2 rounded-lg max-w-xs text-center">
      <p className="text-sm font-medium text-red-700 mb-2">{message}</p>
      {errors && errors.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-red-600 mb-1">Detalles:</p>
          <ul className="text-xs text-red-600 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-1">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
        >
          Subir otra imagen
        </button>
      )}
    </div>
  </div>
);
