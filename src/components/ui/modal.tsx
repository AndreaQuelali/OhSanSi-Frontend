import CloseIcon from '../icons/close';
import { Button } from './button';
import { ButtonIcon } from './button-icon';

export const Modal = ({ onClose, text, onConfirm, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral2 opacity-40"
        onClick={onClose}
      />
      <div className="w-96 h-auto bg-white rounded-xl p-6 relative z-50">
        <div className="w-full flex justify-end">
          <ButtonIcon
            icon={CloseIcon}
            onClick={onClose}
            variantColor="variant2"
          />
        </div>
        <h2 className="subtitle-md mb-4">{text}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex flex-row justify-end space-x-4 mt-6 mb-2">
          <Button onClick={onClose} label="Cancelar" variantColor="variant2" />
          <Button onClick={onConfirm} label="Confirmar" />
        </div>
      </div>
    </div>
  );
};
