import { Button, Dropdown } from '@/components';
import { TableRegisterOli } from './components/table-report-olimpist';
import IconPrint from '@/components/icons/icon-print';
import IconDownloadB from '@/components/icons/icon-downloadb';
import { useFetchData } from '@/hooks/use-fetch-data';
import { API_URL } from '@/config/api-config';
import { useForm } from 'react-hook-form';
import React from 'react';

export const ReportRegisterOliPage = () => {
  const {
    register,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const { data: olympiads } = useFetchData<
    { id_olimpiada: number; gestion: number; nombre_olimpiada: string }[]
  >(`${API_URL}/olimpiadas`);

  const data = [
    {
      Nombre: 'María Fernanda',
      Apellido: 'Gutiérrez López',
      CIOlimpista: '7894561',
      Departamento: 'Cochabamba',
      Provincia: 'Quillacollo',
      UnidadEducativa: 'Unidad Educativa Santa María',
      Grado: '6to de Secundaria',
      Area: 'Matemáticas',
      NivelCategoria: '6S',
    },
    {
      Nombre: 'José Andrés',
      Apellido: 'Mamani Ticona',
      CIOlimpista: '6543217',
      Departamento: 'La Paz',
      Provincia: 'Murillo',
      UnidadEducativa: 'Unidad Educativa Illimani',
      Grado: '5to de Secundaria',
      Area: 'Física',
      NivelCategoria: '5S',
    },
    {
      Nombre: 'Ana Luisa',
      Apellido: 'Flores Chávez',
      CIOlimpista: '9812763',
      Departamento: 'Santa Cruz',
      Provincia: 'Andrés Ibáñez',
      UnidadEducativa: 'Colegio Nacional 24 de Septiembre',
      Grado: '6to de Secundaria',
      Area: 'Biología',
      NivelCategoria: '6S',
    },
    {
      Nombre: 'Carlos Eduardo',
      Apellido: 'Quispe Callisaya',
      CIOlimpista: '3478129',
      Departamento: 'Potosí',
      Provincia: 'Tomás Frías',
      UnidadEducativa: 'Unidad Educativa Sucre',
      Grado: '4to de Secundaria',
      Area: 'Química',
      NivelCategoria: '4S',
    },
    {
      Nombre: 'Sofía Isabel',
      Apellido: 'Velásquez Rojas',
      CIOlimpista: '1122334',
      Departamento: 'Oruro',
      Provincia: 'Cercado',
      UnidadEducativa: 'Colegio Don Bosco',
      Grado: '5to de Secundaria',
      Area: 'Matemáticas',
      NivelCategoria: 'Primer Nivel',
    },
    {
      Nombre: 'Luis Alberto',
      Apellido: 'Céspedes Aguilar',
      CIOlimpista: '9988776',
      Departamento: 'Tarija',
      Provincia: 'Cercado',
      UnidadEducativa: 'Unidad Educativa Juan XXIII',
      Grado: '3ro de Secundaria',
      Area: 'Física',
      NivelCategoria: '3S',
    },
    {
      Nombre: 'Pablo',
      Apellido: 'Yucra Choque',
      CIOlimpista: '2233445',
      Departamento: 'Beni',
      Provincia: 'Moxos',
      UnidadEducativa: 'Unidad Educativa Trinidad',
      Grado: '5to de Secundaria',
      Area: 'Química',
      NivelCategoria: '5S',
    },
    {
      Nombre: 'Camila',
      Apellido: 'Zapata Núñez',
      CIOlimpista: '4433221',
      Departamento: 'Pando',
      Provincia: 'Manuripi',
      UnidadEducativa: 'Unidad Educativa Cobija',
      Grado: '4to de Secundaria',
      Area: 'Matemáticas',
      NivelCategoria: '4S',
    },
  ];

  return (
    <main className="w-full flex flex-col items-center">
      <div className="mx-5 mt-10 mb-32 md:w-11/12 ">
        <h2 className="headline-sm text-primary text-center mb-4">
          Reporte de Olimpistas Inscritos
        </h2>
        <div className="w-full flex justify-between">
          <Dropdown
            name="olympiad"
            label="Olimpiada"
            placeholder="Seleccionar olimpiada"
            className="w-full"
            options={
              olympiads?.map((olimpiada) => ({
                id: olimpiada.id_olimpiada.toString(),
                name: `${olimpiada.gestion} - ${olimpiada.nombre_olimpiada}`,
              })) || []
            }
            displayKey="name"
            valueKey="id"
            register={register}
            errors={errors}
            validationRules={{
              required: 'Debe seleccionar un año/gestión',
            }}
          />
          <div className="flex justify-end">
            <Button variantColor="variant4" label="Imprimir" icon={IconPrint} />
            <Button
              variantColor="variant4"
              label="Descargar"
              icon={IconDownloadB}
            />
          </div>
        </div>
        <TableRegisterOli data={data} />
      </div>
    </main>
  );
};
