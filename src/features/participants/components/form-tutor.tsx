import axios from 'axios';
import { Button, Dropdown, InputText, RadioGroup } from '../../../components';
import { useState } from 'react';
import { FormData } from '../interfaces/form-tutor';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

export default function FormTutor() {
  const {
    register,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      
    },
  });

  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col items-center">
        <form className='md:w-9/12 lg:w-9/12'>
          <h1 className="text-center text-primary mb-8 headline-lg">
            Registro de Datos de Tutor
          </h1>
          <div className='mb-5'>
            <RadioGroup
              name="rol"
              label="Tipo de tutor"
              options={[
                { label: 'Tutor legal', value: 'legal' },
                { label: 'Tutor académico', value: 'académico' },
              ]}
              register={register}
              errors={errors}
              validationRules={{ required: 'El tipo de tutor es obligatorio' }}
              direction="row"
            />
          </div>
          <div className='grid grid-cols-3 gap-10 mb-5'>
            <InputText
                label="Número de cédula de identidad"
                name="ci"
                placeholder="Ingresar cédula de identidad"
                className="w-full"
                register={register}
                validationRules={{
                  required: 'El número de cédula es obligatorio',
                  minLength: {
                    value: 4,
                    message: 'Debe tener al menos 4 dígitos',
                  },
                  maxLength: {
                    value: 8,
                    message: 'No puede tener más de 8 dígitos',
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Solo se permiten números',
                  },
                }}
                errors={errors}
            />
            <InputText
              label="Nombre(s)"
              name="name"
              placeholder="Ingresar nombre(s)"
              className="w-full"
              register={register}
              validationRules={{
                required: 'El nombre es obligatorio',
                pattern: {
                  value:
                    /^(?! )[A-Za-zÑñÁÉÍÓÚáéíóú]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú]+)*(?<! )$/,
                  message:
                    'Solo se permiten letras y un solo espacio entre palabras',
                },
              }}
              errors={errors}
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
                  value:
                    /^(?! )[A-Za-zÑñÁÉÍÓÚáéíóú]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú]+)*(?<! )$/,
                  message:
                    'Solo se permiten letras y un solo espacio entre palabras',
                },
              }}
              errors={errors}
            />
          </div>
          <div className='grid grid-cols-2 gap-10 mb-5'>
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
                      /^(?!.*\.\.)(?!.*\.@)(?!^\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
                    message: 'Correo electrónico no válido',
                  },
                }}
                errors={errors}
              />
          </div>
          <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
            <Button
              label="Cancelar"
              variantColor="variant2"
              className="mt-5 md:mt-0"
              onClick={() => navigate('/')}
            />
            <Button
              type="submit"
              label="Registrar"
              disabled={!isValid}
              variantColor={!isValid ? 'variantDesactivate' : 'variant1'}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
