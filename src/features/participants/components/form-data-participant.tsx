import { Dropdown, InputText } from '../../../components';
export default function FormDataPart() {
  return (
      <div className="flex flex-col my-6">
        <div className="flex flex-col flex-grow">
          <form className="max-w-9/12 mx-auto w-full px-0 md:px-0 lg:px-0">
            <h2 className=" text-primary text-lg md:text-2xl font-semibold mb-4 text-center md:text-left">
              Registro de Datos de Olimpista
            </h2>
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <InputText
                label="Nombre(s)"
                name="name"
                placeholder="Lucia Damaris"
                className="w-full md:w-2xs"
              />
              <InputText
                label="Apellido(s)"
                name="lastname"
                placeholder="Quiroz Lopez"
                className="w-full md:w-2xs"
              />
              <InputText
                label="Número de cédula de identidad"
                name="ci"
                placeholder="1234567"
                className="w-full md:w-2xs"
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <InputText
                label="Correo electrónico"
                name="email"
                placeholder="lucia@gmail.com"
                type="email"
                className="w-full md:w-2xs"
              />
              <InputText
                label="Número de celular"
                name="lastname"
                placeholder="77777777"
                className="w-full md:w-2xs"
              />
              <InputText
                label="Fecha de nacimiento"
                name="ci"
                placeholder="DD/MM/AAAA"
                type="date"
                className="w-full md:w-2xs"
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <Dropdown
                label="Unidad educativa"
                name="school"
                placeholder="Seleccionar unidad educativa"
                className="w-full md:w-[620px]"
              />
              <Dropdown
                label={'Grado'}
                name="grade"
                placeholder="Seleccionar grado"
                className="w-full md:w-2xs"
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <Dropdown
                label="Departamento"
                name="depa"
                placeholder="Seleccionar departamento"
                className="w-full md:w-[430px]"
              />
              <Dropdown
                label="Provincia"
                name="prov"
                placeholder="Seleccionar provincia"
                className="w-full md:w-[430px]"
              />
            </div>
          </form>
        </div>
      </div>
  );
}
