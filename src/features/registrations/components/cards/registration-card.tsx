import { Button } from '@/components';
import React from 'react';
import PaymentOrderModal from '../modals/payment-order-modal';
import { PaymentOrderModalInd } from '../modals/payment-order-modal-individual';
import { ModalUploadPay } from '../modals/upload-payment-modal';
import { RegistrationCardProps } from '../../interfaces/registration-card';
import { useRegistrationCard } from '../../hooks/use-registration-card';

const RegistrationCard: React.FC<RegistrationCardProps> = ({
  list,
  registrations,
  isAlternate,
  showGenerateButton,
  showUploadButton,
}) => {
  const isGroup = list.tipo === 'grupal';
  const { state, handlers } = useRegistrationCard(list);

  const {
    handleOpenVisualModal,
    handleOpenModalUpload,
    handleCloseVisualModal,
    handleCloseUploadModal,
  } = handlers;

  return (
    <div
      className={`card w-full h-full p-6 md:p-8 rounded-2xl shadow-md border border-surface hover:shadow-lg transition-shadow ${
        isAlternate ? 'bg-surface' : 'bg-white'
      }`}
    >
      <h4 className="subtitle-md mb-2 text-primary">
        <strong>Inscripción</strong>
      </h4>
      <div className="flex flex-col md:flex-row gap-0 md:gap-10">
        <div className="flex flex-col gap-1 flex-1">
          {' '}
          <p className="subtitle-md">
            {' '}
            <strong>Responsable: </strong>
            {list.responsable}
          </p>
          {!isGroup && (
            <p className="subtitle-md">
              <strong>Estudiante: </strong> {registrations[0]?.nombre}
            </p>
          )}
          {!isGroup && (
            <p className="subtitle-md">
              <strong>Nro de inscripciones:</strong> {registrations.length}
            </p>
          )}{' '}
          {isGroup && (
            <p className="subtitle-md">
              <strong>Nro de estudiantes:</strong> {list.cantidadOlimpistas}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <p className="subtitle-md">
            <strong>CI Responsable:</strong> {list.ci}
          </p>
          {!isGroup && (
            <p className="subtitle-md">
              <strong>CI Estudiante:</strong> {registrations[0]?.ci}
            </p>
          )}
        </div>
        {!isGroup && (
          <div className="flex flex-col gap-1 flex-1">
            {registrations.map((reg, idx) => (
              <div key={idx}>
                <p className="subtitle-md">
                  <strong>Área:</strong> {reg.area}
                </p>
                <p className="subtitle-md">
                  <strong>Nivel/Categoría:</strong> {reg.categoria}
                </p>
              </div>
            ))}
          </div>
        )}
        {isGroup && <div className="flex flex-col gap-1 flex-1"></div>}
        <div className="flex flex-col gap-1 flex-1">
          <p className="subtitle-md">
            <strong>Estado:</strong> {list.estado}
          </p>
        </div>
        {showGenerateButton && (
          <div className="flex flex-col mt-5 md:mt-0 gap-2 ml-auto w-full md:w-auto">
            <Button
              className="w-auto"
              label={isGroup ? 'Generar boleta' : 'Generar boleta'}
              onClick={() => handleOpenVisualModal(showUploadButton)}
            />
          </div>
        )}
        {showUploadButton && (
          <div className="flex flex-col mt-5 md:mt-0 gap-2 ml-auto w-full md:w-auto">
            <Button
              className="w-auto"
              label="Subir comprobante"
              onClick={handleOpenModalUpload}
            />
          </div>
        )}{' '}
        {state.showVisualModal &&
          state.paymentData &&
          state.modalType === 'grupal' && (
            <PaymentOrderModal
              isOpen={state.showVisualModal}
              onClose={handleCloseVisualModal}
              data={
                state.paymentData as import('../../interfaces/payment-order-modal').PaymentDataGroup
              }
            />
          )}{' '}
        {state.showVisualModal &&
          state.paymentData &&
          state.modalType === 'individual' && (
            <PaymentOrderModalInd
              isOpen={state.showVisualModal}
              onClose={handleCloseVisualModal}
              data={
                state.paymentData as import('../../interfaces/payment-order-modal').PaymentData
              }
            />
          )}
        {state.showModalUpload && (
          <ModalUploadPay
            onClose={handleCloseUploadModal}
            id_lista={list.id_lista}
          />
        )}
      </div>
    </div>
  );
};

export default RegistrationCard;
