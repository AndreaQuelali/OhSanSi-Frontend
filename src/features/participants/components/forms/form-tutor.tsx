import { Button, InputText, Modal } from '@/components';
import { FormTutorProps } from '../../interfaces/form-tutor';
import { useNavigate } from 'react-router';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';
import {
  ERROR_MESSAGES,
  VALIDATION_PATTERNS,
  VALIDATION_LIMITS,
  ROUTES,
} from '../../constants/participant-constants';
import { useSubmitTutor, useTutorFormLogic } from '../../hooks';

export default function FormTutor({ viewTB }: FormTutorProps) {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    isRegisteredTutor,
    ciConfirmed,
    showMessage,
  } = useTutorFormLogic();

  const {
    onSubmit,
    onConfirm,
    showModal,
    setShowModal,
    closeConfirmationModal,
    showConfirmationModal,
    confirmationStatus,
    confirmationMessage,
  } = useSubmitTutor();

  const handleNextStep = () => {
    navigate(ROUTES.REGISTER_OLYMPIAN);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseConfirmationModal = () => {
    closeConfirmationModal(() => {
      window.location.reload();
    });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-5 mt-5 mb-32 w-11/12 md:w-9/12 lg:w-9/12"
        >
          {viewTB && (
            <h1 className="text-center text-primary mb-8 md:mb-10 headline-lg">
              Registro de Datos de Tutor
            </h1>
          )}
          <h2 className="text-primary subtitle-sm mb-2 ">
            Primero ingrese el número de cédula de identidad del tutor que desea
            registrar.
          </h2>
          <div className="grid grid-cols-1 lg:gap-12 lg:mb-5">
            <InputText
              label="Número de cédula de identidad"
              name="ci"
              placeholder="Ingresar cédula de identidad"
              className="w-full"
              register={register}
              validationRules={{
                required: ERROR_MESSAGES.REQUIRED_CI,
                pattern: {
                  value: VALIDATION_PATTERNS.CI,
                  message: ERROR_MESSAGES.INVALID_CI,
                },
                minLength: {
                  value: VALIDATION_LIMITS.CI_MIN_LENGTH,
                  message: ERROR_MESSAGES.CI_MIN_LENGTH,
                },
                maxLength: {
                  value: VALIDATION_LIMITS.CI_MAX_LENGTH,
                  message: ERROR_MESSAGES.CI_MAX_LENGTH,
                },
              }}
              errors={errors}
            />
          </div>
          <div
            className={`
              transition-all duration-1000 ease-in-out transform overflow-hidden
              ${
                ciConfirmed
                  ? 'opacity-100 translate-y-0 max-h-full pointer-events-auto'
                  : 'opacity-0 -translate-y-10 max-h-0 pointer-events-none'
              }
            `}
          >
            <div
              className={`
              overflow-hidden transition-all duration-500 ease-in-out
              ${showMessage ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'}
            `}
            >
              <div className="bg-surface border-l-4 subtitle-sm border-primary text-onBack p-4 mb-6 rounded">
                <p>
                  Este número de cédula ya está registrado. Si desea registrar a
                  un olimpista, puedes continuar con el siguiente paso.
                </p>
                <div className="mt-3 flex justify-end">
                  <Button
                    label="Ir a formulario de registro de olimpista"
                    onClick={() => navigate(ROUTES.REGISTER_OLYMPIAN)}
                    variantColor="variant4"
                  />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 lg:gap-12 lg:mb-5">
              <InputText
                label="Nombre(s)"
                name="name"
                placeholder="Ingresar nombre(s)"
                className="w-full"
                register={register}
                validationRules={{
                  required: ERROR_MESSAGES.REQUIRED_NAME,
                  pattern: {
                    value: VALIDATION_PATTERNS.NAME,
                    message: ERROR_MESSAGES.INVALID_NAME,
                  },
                }}
                errors={errors}
                disabled={isRegisteredTutor}
              />
              <InputText
                label="Apellido(s)"
                name="lastname"
                placeholder="Ingresar apellido(s)"
                className="w-full"
                register={register}
                validationRules={{
                  required: ERROR_MESSAGES.REQUIRED_LASTNAME,
                  pattern: {
                    value: VALIDATION_PATTERNS.LASTNAME,
                    message: ERROR_MESSAGES.INVALID_LASTNAME,
                  },
                }}
                errors={errors}
                disabled={isRegisteredTutor}
              />
            </div>
            <div className="grid md:grid-cols-2 md:gap-12 mb-5">
              <InputText
                label="Número de celular"
                name="phone"
                placeholder="Ingresar número de celular"
                className="w-full"
                register={register}
                validationRules={{
                  required: ERROR_MESSAGES.REQUIRED_PHONE,
                  pattern: {
                    value: VALIDATION_PATTERNS.PHONE,
                    message: ERROR_MESSAGES.INVALID_PHONE,
                  },
                  maxLength: {
                    value: VALIDATION_LIMITS.PHONE_MAX_LENGTH,
                    message: ERROR_MESSAGES.PHONE_MAX_LENGTH,
                  },
                }}
                errors={errors}
                disabled={isRegisteredTutor}
              />
              <InputText
                label="Correo electrónico"
                name="email"
                placeholder="Ingresar correo electrónico"
                type="email"
                className="w-full"
                register={register}
                validationRules={{
                  required: ERROR_MESSAGES.REQUIRED_EMAIL,
                  pattern: {
                    value: VALIDATION_PATTERNS.EMAIL,
                    message: ERROR_MESSAGES.INVALID_EMAIL,
                  },
                }}
                errors={errors}
                disabled={isRegisteredTutor}
              />
            </div>
            <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
              {!isRegisteredTutor ? (
                <>
                  <Button
                    label="Cancelar"
                    variantColor="variant2"
                    className="mt-5 md:mt-0"
                    onClick={() => navigate(ROUTES.OLYMPIAN_MENU)}
                  />
                  <Button
                    type="submit"
                    label="Registrar"
                    disabled={!isValid || !!errors.ci}
                    variantColor={
                      !isValid || !!errors.ci
                        ? 'variantDesactivate'
                        : 'variant1'
                    }
                  />
                </>
              ) : (
                <div className="flex justify-end mt-5">
                  <Button
                    label="Cancelar"
                    variantColor="variant2"
                    onClick={() => navigate(ROUTES.OLYMPIAN_MENU)}
                  />
                </div>
              )}
            </div>
          </div>
        </form>
        {showModal && (
          <Modal
            onClose={onCloseModal}
            text={ERROR_MESSAGES.CONFIRMATION_TEXT_TUTOR}
            onConfirm={onConfirm}
          />
        )}
        {showConfirmationModal && (
          <ConfirmationModal
            onClose={handleCloseConfirmationModal}
            status={confirmationStatus || 'error'}
            message={confirmationMessage}
            nextStepText={
              confirmationStatus === 'success'
                ? ERROR_MESSAGES.NEXT_STEP_TEXT_TUTOR
                : undefined
            }
            onNextStep={
              confirmationStatus === 'success' ? handleNextStep : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
