import { Button, InputText, Modal} from '../../../components';
import { useState, useEffect } from 'react';
import { FormData } from '../interfaces/form-tutor';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useApiForm } from '@/hooks/use-api-form';
import { getData } from '@/services/api-service';

type FormTutorProps = {
  viewTB: boolean;
};

export default function FormTutor({ viewTB }: FormTutorProps) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {},
  });

  const ciValue = watch('ci');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const { submitForm } = useApiForm('/tutores');
  const [isRegisteredTutor, setIsRegisteredTutor] = useState(false);
  const [ciTutorFound, setCiTutorFound] = useState<string | null>(null);
  const [ciConfirmed, setCiConfirmed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const onSubmit = async (data: FormData) => {
    setFormData(data);
    setShowModal(true);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const onConfirm = async () => {
    if (!formData) return;

    const payload = {
      nombres: formData.name,
      apellidos: formData.lastname,
      ci: formData.ci,
      celular: formData.phone,
      correo_electronico: formData.email,
    };

    try {
      const response = await submitForm(payload);
      if (response) {
        alert('Registro exitoso del tutor');
        window.location.reload();
      }
    } catch (error: any) {
      if (error.data?.errors) {
        const messages = Object.values(error.data.errors).flat().join('\n');
        alert(messages);
      } else {
        alert(error.data?.message || 'Ocurrió un error. Intenta de nuevo.');
      }
    }

    setShowModal(false);
    };
      
    useEffect(() => {
      const verificarCI = async () => {
        if (!ciValue || String(ciValue).length < 4) {
          clearErrors('ci');
          setIsRegisteredTutor(false);
          setCiTutorFound(null);
          return;
        }

        try {
          const response = await getData(`/tutores/cedula/${ciValue}`);
          if (response && response.tutor) {
            setValue('name', response.tutor.nombres || '');
            setValue('lastname', response.tutor.apellidos || '');
            setValue('email', response.tutor.correo_electronico || '');
            setValue('phone', response.tutor.celular || '');

            setError('ci', {
              type: 'manual',
              message: 'Este número de cédula ya está registrado',
            });
            setIsRegisteredTutor(true);
            setCiTutorFound(ciValue); 
          } else {
            clearErrors('ci');
            setIsRegisteredTutor(false);
            setCiTutorFound(null);

            setValue('name', '');
            setValue('lastname', '');
            setValue('email', '');
            setValue('phone', '');
          }
        } catch (error: any) {
          clearErrors('ci');
          setIsRegisteredTutor(false);
          setCiTutorFound(null);
        }
      };

      verificarCI();
    }, [ciValue, setError, clearErrors, setValue]);

    useEffect(() => {
      if (ciTutorFound && ciValue !== ciTutorFound) {
        clearErrors('ci');
        setIsRegisteredTutor(false);
        setCiTutorFound(null);
        setValue('name', '');
        setValue('lastname', '');
        setValue('email', '');
        setValue('phone', '');
      }
    }, [ciValue, ciTutorFound, clearErrors, setValue]);

    useEffect(() => {
      if (ciValue && String(ciValue).length >= 4 && /^[0-9]+$/.test(ciValue)) {
        setCiConfirmed(true);
      } else {
        setCiConfirmed(false);
      }
    }, [ciValue]);

    useEffect(() => {
      if (isRegisteredTutor) {
        setShowMessage(true); 
      } else {
        const timeout = setTimeout(() => setShowMessage(false), 50); 
        return () => clearTimeout(timeout);
      }
    }, [isRegisteredTutor]);

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
          <h2 className="text-primary subtitle-sm mb-2 ">Primero ingrese el número de cédula de identidad del tutor que desea registrar.</h2>
          <div className="grid grid-cols-1 lg:gap-12 lg:mb-5">
            <InputText
              label="Número de cédula de identidad"
              name="ci"
              placeholder="Ingresar cédula de identidad"
              className="w-full"
              register={register}
              validationRules={{
                required: 'El número de cédula es obligatorio',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Solo se permiten números',
                },
                minLength: {
                  value: 4,
                  message: 'Debe tener al menos 4 dígitos',
                },
                maxLength: {
                  value: 8,
                  message: 'No puede tener más de 8 dígitos',
                },
              }}
              errors={errors}
            />
          </div>
          <div
            className={`
              transition-all duration-1000 ease-in-out transform overflow-hidden
              ${ciConfirmed
                ? 'opacity-100 translate-y-0 max-h-[1000px] pointer-events-auto'
                : 'opacity-0 -translate-y-10 max-h-0 pointer-events-none'}
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
                Este número de cédula ya está registrado. Si deseas registrar a un olimpista, 
                puedes continuar con el siguiente paso.
              </p>
              <div className="mt-3 flex justify-end">
                <Button
                  label="Ir a formulario de registro de olimpista"
                  onClick={() => navigate(`/register-olimpists`)}
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
                required: 'El nombre es obligatorio',
                pattern: {
                  value: /^[A-ZÑÁÉÍÓÚ]+(?: [A-ZÑÁÉÍÓÚ]+)*$/,
                  message:
                    'Solo se permiten letras mayúsculas y un solo espacio entre palabras',
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
                required: 'El apellido es obligatorio',
                pattern: {
                  value: /^[A-ZÑÁÉÍÓÚ]+(?: [A-ZÑÁÉÍÓÚ]+)*$/,
                  message:
                    'Solo se permiten letras mayúsculas y un solo espacio entre palabras',
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
                required: 'El número de celular es obligatorio',
                pattern: {
                  value: /^[0-9]{8,}$/,
                  message: 'Debe contener solo números y al menos 8 dígitos',
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
                required: 'El correo electrónico es obligatorio',
                pattern: {
                  value:
                    /^[a-zA-Z0-9](?!.*[._-]{2})(\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*\.[a-zA-Z]{2,}$/,
                  message: 'Correo electrónico no válido',
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
                  onClick={() => navigate('/')}
                />
                <Button
                  type="submit"
                  label="Registrar"
                  disabled={!isValid || !!errors.ci}
                  variantColor={!isValid || !!errors.ci ? 'variantDesactivate' : 'variant1'}
                />
              </>
            ) : (
              <div className="flex justify-end mt-5">
                <Button
                  label="Cancelar"
                  variantColor="variant2"
                  onClick={() => navigate('/')}
                />
              </div>
            )}
          </div>
        </div>
        </form>
        {showModal && (
          <Modal
            onClose={onCloseModal}
            text="¿Estás seguro de registrar los datos del tutor?"
            onConfirm={onConfirm}
          />
        )}
      </div>
    </div>
  );
}
