import { Button, ButtonIcon } from '@/components';
import CloseIcon from '@/components/icons/close';
import IconFile from '@/components/icons/icon-file';
import IconNoFile from '@/components/icons/icon-no-file';
import { ModalUploadPaymentProps } from '../../interfaces/modal-upload-payment';
import { useUploadPayment } from '../../hooks/use-upload-payment';
import {
  ErrorAnimation,
  ScanningAnimation,
  SuccessAnimation,
} from '../animations/scanning-animation';

export const ModalUploadPay = ({
  onClose,
  id_lista,
}: ModalUploadPaymentProps) => {
  const { state, ref, handlers } = useUploadPayment(onClose, id_lista);

  const {
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleSubmitImage,
    handleCancel,
    handleRetry,
  } = handlers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral2 opacity-40"
        onClick={onClose}
      />
      <div className="w-2xl h-auto bg-white rounded-xl p-6 relative z-50 max-w-xl">
        <div className="w-full flex justify-end">
          <ButtonIcon
            icon={CloseIcon}
            onClick={onClose}
            variantColor="variant2"
          />
        </div>
        <h2 className="headline-sm text-primary text-center mb-4">
          Comprobante de Pago
        </h2>{' '}
        <div className="w-full max-w-md mx-auto">
          <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition duration-200 relative ${
              state.dragActive
                ? 'border-secondary2 bg-secondary2/25'
                : state.imagePreview
                  ? 'border-secondary2 bg-secondary2/5 hover:border-primary hover:bg-primary2/5'
                  : 'border-neutral2 bg-transparent hover:border-primary'
            }`}
          >
            {state.imagePreview && state.enhancedPreview ? (
              <div className="flex flex-col items-center relative w-full">
                <div className="flex flex-col items-center relative w-full h-64">
                  <img
                    src={state.enhancedPreview}
                    alt="Mejorada"
                    className="w-full h-full object-contain rounded-md border border-green-400"
                  />

                  {state.isSubmitting && <ScanningAnimation />}

                  {state.showSuccess &&
                    state.verificationResult?.verificacion_pago && (
                      <SuccessAnimation
                        message={
                          state.verificationResult?.verificacion_pago.mensaje
                        }
                      />
                    )}

                  {state.showError && (
                    <ErrorAnimation
                      message={
                        state.verificationResult?.verificacion_pago === null
                          ? 'Por favor, sube un comprobante de pago válido.'
                          : state.verificationResult?.verificacion_pago
                              ?.mensaje || 'Error al verificar el pago'
                      }
                      errors={
                        state.verificationResult?.verificacion_pago
                          ?.detalle_errores
                      }
                      onRetry={handleRetry}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-row items-center gap-5">
                <div>{state.fileName ? <IconFile /> : <IconNoFile />}</div>
                <div className="mr-2 text-center">
                  <p className="subtitle-md text-onBack">
                    {state.fileName || 'Ningún archivo seleccionado'}
                  </p>
                  <p className="body-md text-primary hover:text-secondary2 mt-1 underline transition">
                    Selecciona o arrastra la imagen aquí
                  </p>
                </div>
              </div>
            )}

            <input
              ref={ref}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>{' '}
        <div className="flex flex-row justify-end space-x-4 mt-6 mb-2">
          <Button
            onClick={handleCancel}
            label={state.isSubmitting ? 'Cancelar Subida' : 'Cancelar'}
            variantColor="variant2"
          />
          <Button
            onClick={handleSubmitImage}
            label={state.isSubmitting ? 'Verificando...' : 'Subir Imagen'}
            disabled={
              !state.enhancedPreview ||
              state.isSubmitting ||
              !state.imagePreview
            }
            variantColor={
              state.showSuccess
                ? 'variant3'
                : !state.enhancedPreview || !state.imagePreview
                  ? 'variantDesactivate'
                  : 'variant1'
            }
          />
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          50% {
            top: 50%;
          }
          100% {
            top: 100%;
          }
        }
      `}</style>
    </div>
  );
};
