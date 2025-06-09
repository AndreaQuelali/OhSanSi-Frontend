// src/components/LoginCard.tsx
import { Button, InputText } from '@/components';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

type FormData = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {},
  });

  const navigate = useNavigate();
  localStorage.setItem('userRole', 'user');

  return (
    <div className=" bg-white flex items-center justify-center mt-10">
      <div className="w-11/12 max-w-md bg-white rounded-xl shadow-md">
        <div className="h-2 rounded-t-xl bg-primary"></div>

        <div className="p-8">
          <h2 className="text-center headline-lg  font-semibold text-primary mb-6">
            Inicio de Sesión
          </h2>

          <form>
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
            />
            <InputText
              label="Contraseña"
              name="password"
              placeholder="Ingresar contraseña"
              type="password"
              className="w-full"
              register={register}
              validationRules={{
                required: 'La contraseña es obligatoria',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              }}
              errors={errors}
            />

            {/* Link restablecer
            <div className="text-left">
              <a href="#" className="text-xs text-[#2F236F] hover:underline">
                Restablecer contraseña
              </a>
            </div> */}
            <div className="flex justify-end space-x-4">
              <Button
                variantColor="variant2"
                label="Cancelar"
                onClick={() => {
                  navigate('/');
                }}
              />
              <Button
                label="Aceptar"
                onClick={() => {
                  localStorage.setItem('userRole', 'admin');
                  navigate('/administrator');
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
