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
      return;
    }

    try {
      const response = await getData(`/tutores/cedula/${ciValue}`);
      if (response && response.tutor) {
        // Tutor registrado → rellenar campos
        setValue('name', response.tutor.nombres || '');
        setValue('lastname', response.tutor.apellidos || '');
        setValue('email', response.tutor.correo_electronico || '');
        setValue('phone', response.tutor.celular || '');

        setError('ci', {
          type: 'manual',
          message: 'Este número de cédula ya está registrado',
        });

        setIsRegisteredTutor(true);
      } else {
        // Tutor NO registrado: limpiar los campos que fueron autocompletados previamente
        clearErrors('ci');
        setIsRegisteredTutor(false);

        // Aquí limpiamos solo si el CI cambió a uno NO registrado
        // para evitar confusiones
        setValue('name', '');
        setValue('lastname', '');
        setValue('email', '');
        setValue('phone', '');
      }
    } catch (error: any) {
      clearErrors('ci');
      setIsRegisteredTutor(false);
      // En caso de error de red: no limpiar datos escritos manualmente
    }
  };

  verificarCI();
}, [ciValue, setError, clearErrors, setValue]);



  return (
    <div className="flex flex-col w-full">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-5 mt-10 mb-32 w-11/12 md:w-9/12 lg:w-9/12"
        >
          {viewTB && (
            <h1 className="text-center text-primary mb-8 md:mb-20 headline-lg">
              Registro de Datos de Tutor
            </h1>
          )}
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
            {viewTB ? (
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
              <Button
                type="submit"
                label="Registrar tutor"
                disabled={!isValid}
                variantColor={!isValid ? 'variantDesactivate' : 'variant1'}
              />
            )}
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
