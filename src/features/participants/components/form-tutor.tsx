import { Button, Dropdown, InputText } from '../../../components';
export default function FormTutor() {
  return (
    <div className=" flex flex-col my-6">
      <div className="flex flex-col items-center justify-center flex-grow">
        <form className="max-w-9/12 mx-auto w-full px-0 md:px-0 lg:px-0">
          <h1 className="text-primary text-lg md:text-2xl font-semibold mb-4 text-center md:text-left">
            Registro de Datos de Tutor
          </h1>
          <div className="px-0 md:px-3 lg:px-0 flex flex-col md:flex-row md:gap-6 justify-between mb-6">
            <InputText
              label="Nombre(s)"
              name="name"
              placeholder="Carlos Santiago"
              className="w-full md:w-[320px] lg:w-[400px]"
            />
            <InputText
              label="Apellido(s)"
              name="lastname"
              placeholder="Paredes Soliz"
              className="w-full md:w-[320px] lg:w-[400px]"
            />
          </div>

          <div className="px-0 md:px-3 lg:px-0 flex flex-col md:flex-row md:gap-6 justify-between mb-6">
            <InputText
              label="Número de cédula de identidad"
              name="ci"
              placeholder="1234567"
              className="w-full md:w-[320px] lg:w-[400px]"
            />
            <InputText
              label="Número de celular"
              name="phone"
              placeholder="77777777"
              className="w-full md:w-[320px] lg:w-[400px]"
            />
          </div>

          <div className="px-0 md:px-3 lg:px-0 flex flex-col md:flex-row md:gap-6 justify-between mb-6">
            <InputText
              label="Correo electrónico"
              name="email"
              placeholder="carlos@gmail.com"
              type="email"
              className="w-full md:w-[320px] lg:w-[400px]"
            />
            <Dropdown
              label="Rol/Parentesco"
              name="rol"
              placeholder="Seleccionar rol o parentesco"
              className="w-full md:w-[320px] lg:w-[400px] h-[50px]"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
