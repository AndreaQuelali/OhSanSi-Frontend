import CloseIcon from '../icons/close';
import CheckIcon from '../icons/icon-check';
import IconClose from '../icons/icon-close'; 
import { Button } from './button';
import { ButtonIcon } from './button-icon';

export const ConfirmationModal = ({
  onClose,
  status,
  message,
  nextStepText,
  onNextStep,
}: ConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral2 opacity-40"
        onClick={onClose}
      />
      <div className="w-96 md:w-2/3 lg:w-1/3 h-auto bg-white rounded-xl p-6 relative z-50">
        <div className="w-full flex justify-end">
          <ButtonIcon
            icon={CloseIcon}
            onClick={onClose}
            variantColor="variant2"
          />
        </div>
        <div className="flex flex-row items-center">
          <div>
            {status === 'success' ? (
              <CheckIcon classname="text-primary w-6 h-6 mb-2.5" />
            ) : (
              <IconClose className="text-error w-6 h-6 mb-2.5" />
            )}
          </div>
          <h2
            className={`subtitle-md mb-2 ml-1 ${
              status === 'success' ? 'text-primary' : 'text-error'
            }`}
          >
            {status === 'success' ? 'Éxito' : 'Error'}
          </h2>
        </div>
        <div className="body-lg text-onBack whitespace-pre-line">
          {message}
        </div>
        <div className="flex justify-end space-x-2 mb-4">
          {status === 'success' && nextStepText && onNextStep && (
            <Button
              label={nextStepText}
              onClick={onNextStep}
              variantColor="variant4"
            />
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            label="Aceptar"
            onClick={onClose}
            variantColor="variant1"
          />
        </div>
      </div>
    </div>
  );
};
