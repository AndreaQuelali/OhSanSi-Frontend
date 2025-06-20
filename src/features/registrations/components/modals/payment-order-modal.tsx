import React from 'react';
import { Button, ButtonIcon } from '@/components';
import CloseIcon from '@/components/icons/close';
import { PaymentOrderGroupModalProps } from '../../interfaces/payment-order-modal';
import { usePaymentOrderGroupModal } from '../../hooks/use-payment-order-group-modal';
import { PaymentOrderGroupContent } from '../templates/payment-order-group-content';

const PaymentOrderModal: React.FC<PaymentOrderGroupModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { contentRef, handleDownload, formattedData } =
    usePaymentOrderGroupModal(data);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral2 opacity-40"
        onClick={onClose}
      />
      <div className="w-4xl bg-white rounded-xl p-6 relative z-50">
        <div className="w-full flex justify-end">
          <ButtonIcon
            icon={CloseIcon}
            onClick={onClose}
            variantColor="variant2"
          />
        </div>{' '}
        <div ref={contentRef} className="px-6">
          <PaymentOrderGroupContent formattedData={formattedData} />
        </div>
        <div className="flex justify-end space-x-4 mt-6 px-6">
          <Button onClick={handleDownload} label="Descargar" />
        </div>
      </div>
    </div>
  );
};

export default PaymentOrderModal;
