import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { CustomPagination } from '@/components';

interface OlimpistaRow {
  Nombre: string;
  Apellido: string;
  CIOlimpista: string;
  FechadeNacimiento: string;
  Correoelectronico: string;
  Departamento: string;
  Provincia: string;
  UnidadEducativa: string;
  Grado: string;
  NombresTutorLegal: string;
  ApellidosTutorLegal: string;
  CITutorLegal: string;
  CelularTutorLegal: string;
  CorreoelectronicoTutorLegal: string;
  Area: string;
  NivelCategoria: string;
  NombresProfesor: string;
  ApellidosProfesor: string;
  CIProfesor: string;
  CelularProfesor: string;
  CorreoelectronicoProfesor: string;
}

type TableProps = {
  data: OlimpistaRow[];
};

const columns: TableColumn<OlimpistaRow>[] = [
  { name: 'Nombre(s)', selector: row => row.Nombre, sortable: true },
  { name: 'Apellido(s)', selector: row => row.Apellido, sortable: true },
  { name: 'CI Olimpista', selector: row => row.CIOlimpista, sortable: true },
  { name: 'Fecha de Nacimiento', selector: row => row.FechadeNacimiento, sortable: true },
  { name: 'Correo electrónico', selector: row => row.Correoelectronico, sortable: true },
  { name: 'Departamento', selector: row => row.Departamento, sortable: true },
  { name: 'Provincia', selector: row => row.Provincia, sortable: true },
  { name: 'Unidad Educativa', selector: row => row.UnidadEducativa, sortable: true },
  { name: 'Grado', selector: row => row.Grado, sortable: true },
  { name: 'Nombre(s) tutor legal', selector: row => row.NombresTutorLegal, sortable: true },
  { name: 'Apellido(s) tutor legal', selector: row => row.ApellidosTutorLegal, sortable: true },
  { name: 'CI tutor legal', selector: row => row.CITutorLegal, sortable: true },
  { name: 'Celular tutor legal', selector: row => row.CelularTutorLegal, sortable: true },
  { name: 'Correo electrónico tutor legal', selector: row => row.CorreoelectronicoTutorLegal, sortable: true },
  { name: 'Área', selector: row => row.Area, sortable: true },
  { name: 'Nivel/Categoría', selector: row => row.NivelCategoria, sortable: true },
  { name: 'Nombre(s) profesor', selector: row => row.NombresProfesor, sortable: true },
  { name: 'Apellido(s) profesor', selector: row => row.ApellidosProfesor, sortable: true },
  { name: 'CI profesor', selector: row => row.CIProfesor, sortable: true },
  { name: 'Celular profesor', selector: row => row.CelularProfesor, sortable: true },
  { name: 'Correo electrónico profesor', selector: row => row.CorreoelectronicoProfesor, sortable: true },
];

const customStyles = {
  headCells: {
    style: {
      fontFamily: 'Lato, sans-serif',
      fontSize: '16px',
      fontWeight: '500',
      color: '#0e1217',
    },
  },
};

export const TablaOlimpistas: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="w-full overflow-x-auto">
      {data.length === 0 ? (
        <div className="text-center text-neutral2 body-lg p-4">
          No hay datos cargados.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pagination
          paginationPerPage={10}
          paginationComponent={CustomPagination}
          customStyles={customStyles}
          noHeader
          responsive
          highlightOnHover
        />
      )}
    </div>
  );
};
