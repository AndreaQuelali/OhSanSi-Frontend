import { useEffect, useRef } from 'react';
import { Button, ButtonIcon } from '@/components';
import CloseIcon from '@/components/icons/close';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  title?: string;
}

export default function ErrorModal({
  isOpen,
  onClose,
  errorMessage,
  title = 'Se ha producido un error',
}: ErrorModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral2 opacity-40"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="w-4/12 bg-white rounded-xl p-6 relative z-50 max-h-[90vh] flex flex-col"
      >
        <div className="w-full flex justify-end">
          <ButtonIcon
            icon={CloseIcon}
            onClick={onClose}
            variantColor="variant2"
          />
        </div>

        <h2 className="text-error subtitle-md mb-4">{title}</h2>

        <div className="body-md text-neutral whitespace-pre-line overflow-y-auto pr-2 max-h-[300px]">
          {errorMessage}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            label="Cerrar"
            variantColor="variant1"
            onClick={onClose}
            type="button"
          />
        </div>
      </div>
    </div>
  );
}
