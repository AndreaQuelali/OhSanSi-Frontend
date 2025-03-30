import { Button } from "./button";
import { ButtonIcon } from "./button-icon";

export const Modal = ({ onClose, text, onConfirm }: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface bg-opacity-30 z-50">
      <div className="w-96 h-auto bg-white rounded-xl p-6">
        <div className="w-full flex justify-end">
          <ButtonIcon icon={icon} onClick={onClose} variantColor="variant2" />
        </div>

        <p className="subtitle-md text-onBack p-2 text-center">{text}</p>
        <div className="flex flex-row justify-end space-x-4 mt-6 mb-2">
          <Button onClick={onClose} label="Cancelar" variantColor="variant2" />
          <Button onClick={onConfirm} label="Confirmar" />
        </div>
      </div>
    </div>
  );
};
