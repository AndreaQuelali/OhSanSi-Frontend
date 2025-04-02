import CloseIcon from '../icons/close';
import { Button } from './button';
import { ButtonIcon } from './button-icon';

export const Modal = ({ onClose, text, onConfirm, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface bg-opacity-10 z-50">
      <div className="w-96 h-auto bg-white rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">{text}</h2>
        <div className="mb-4">{children}</div>
        <div className="w-full flex justify-end">
          <ButtonIcon
            icon={CloseIcon}
            onClick={onClose}
            variantColor="variant2"
          />
        </div>

        <div className="flex flex-row justify-end space-x-4 mt-6 mb-2">
          <Button onClick={onClose} label="Cancelar" variantColor="variant2" />
          <Button onClick={onConfirm} label="Confirmar" />
        </div>
      </div>
    </div>
  );
};
