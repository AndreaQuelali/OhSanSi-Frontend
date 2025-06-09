import { Button, InputText } from '@/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { postDataAsJson } from '@/services/api-service';
import { FormData, LoginResponse } from './types/login';

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {},
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<string>('');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setLoginError('');
    setLoginSuccess('');
    try {
      const response: LoginResponse = await postDataAsJson('/login', {
        email: data.email,
        password: data.password,
      });
      if (response.success && response.token && response.user) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', response.user.name);
        localStorage.setItem('userEmail', response.user.email);
        setLoginSuccess(`¡Bienvenido ${response.user.name}!`);

        navigate('/administrator');
      } else {
        setLoginError(response.message || 'Error de autenticación');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as {
          response?: { data?: { message?: string; success?: boolean } };
        };
        if (apiError.response?.data?.message) {
          setLoginError(apiError.response.data.message);
        } else if (apiError.response?.data?.success === false) {
          setLoginError(
            apiError.response.data.message || 'Credenciales incorrectas',
          );
        } else {
          setLoginError('Error de conexión. Intenta nuevamente.');
        }
      } else {
        setLoginError('Error de conexión. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-white flex items-center justify-center mt-10">
      <div className="w-11/12 max-w-md bg-white rounded-xl shadow-md">
        <div className="h-2 rounded-t-xl bg-primary"></div>

        <div className="p-8">
          <h2 className="text-center headline-lg  font-semibold text-primary mb-6">
            Inicio de Sesión
          </h2>{' '}
          <form onSubmit={handleSubmit(onSubmit)}>
            {loginSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-success text-center font-medium">
                  {loginSuccess}
                </p>
              </div>
            )}

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-error text-center">{loginError}</p>
              </div>
            )}

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
            <div className="flex justify-end space-x-4">
              <Button
                variantColor="variant2"
                label="Cancelar"
                onClick={() => {
                  navigate('/');
                }}
                type="button"
              />
              <Button
                label={isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                type="submit"
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
