import { Button, Dropdown, InputText } from '../../../components';
export default function FormTutor() {
  return (
    <div className="flex flex-col my-6">
      <div className="flex flex-col items-center justify-center flex-grow">
        <form className="max-w-9/12 mx-auto w-full px-0 sm:px-6 md:px-0">
          <h1 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center sm:text-left">
            Registro de Datos de Tutor
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <InputText
              label="Nombre(s)"
              name="name"
              placeholder="Carlos Santiago"
              className="w-full"
            />
            <InputText
              label="Apellido(s)"
              name="lastname"
              placeholder="Paredes Soliz"
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <InputText
              label="Número de cédula"
              name="ci"
              placeholder="1234567"
              className="w-full"
            />
            <InputText
              label="Número de celular"
              name="phone"
              placeholder="77777777"
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputText
              label="Correo electrónico"
              name="email"
              placeholder="carlos@gmail.com"
              type="email"
              className="w-full"
            />
            <Dropdown
              label="Rol/Parentesco"
              name="rol"
              placeholder="Seleccionar rol o parentesco"
              className="w-full h-[50px]"
            />
          </div>
        </form>
      </div>
    </div>
  );
}