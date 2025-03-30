import { Button, Dropdown, InputText } from '../../../components';
export default function FormTutor() {
  return (
    <div className=" flex flex-col my-6">
      <div className="flex flex-col items-center justify-center flex-grow">
        <form className="max-w-9/12 mx-auto w-full">
          <h1 className=" text-primary mb-2 headline-md">
            Registro de Datos de Tutor
          </h1>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-6">
            <InputText
              label="Nombre(s)"
              name="name"
              placeholder="Carlos Santiago"
              className="w-[400px]"
            />
            <InputText
              label="Apellido(s)"
              name="lastname"
              placeholder="Paredes Soliz"
              className="w-[400px]"
            />
          </div>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-6">
            <InputText
              label="Número de cédula de identidad"
              name="ci"
              placeholder="1234567"
              className="w-[400px]"
            />
            <InputText
              label="Número de celular"
              name="lastname"
              placeholder="77777777"
              className="w-[400px]"
            />
          </div>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-6">
            <InputText
              label="Correo electrónico"
              name="email"
              placeholder="carlos@gmail.com"
              type="email"
              className="w-[400px]"
            />
            <Dropdown
              label="Rol/Parentesco"
              name="rol"
              placeholder="Seleccionar rol o parentesco"
              type="date"
              className="w-[400px] h-[50px]"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
