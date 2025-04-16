import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { CustomPagination } from '@/components';

interface OlimpistaRow {
  CIOlimpista: string;
  Nombre: string;
  Apellido: string;
  FechadeNacimiento: string;
  Correoelectronico: string;
  Departamento: string;
  Provincia: string;
  UnidadEducativa: string;
  Grado: string;
  NombresTutorLegal: string;
  ApellidosTutorLegal: string;
  CITutorLegal: string;
  Celular: string;
  CorreoelectronicoTutorLegal: string;
  Rol: string;
  Area: string;
  NivelCategoria: string;
}

type TableProps = {
  data: OlimpistaRow[];
};

const columns: TableColumn<OlimpistaRow>[] = [
  {
    name: 'CI Olimpista',
    selector: (row) => row.CIOlimpista,
    sortable: true,
    cell: (row) => <div className="p-2">{row.CIOlimpista}</div>,
  },
  {
    name: 'Nombre(s)',
    selector: (row) => row.Nombre,
    sortable: true,
    cell: (row) => <div className="p-2">{row.Nombre}</div>,
  },
  {
    name: 'Apellido(s)',
    selector: (row) => row.Apellido,
    sortable: true,
    cell: (row) => <div className="p-2">{row.Apellido}</div>,
  },
  {
    name: 'Unidad Educativa',
    selector: (row) => row.UnidadEducativa,
    sortable: true,
    cell: (row) => <div className="p-2">{row.UnidadEducativa}</div>,
  },
  {
    name: 'Área',
    selector: (row) => row.Area,
    sortable: true,
    cell: (row) => <div className="p-2">{row.Area}</div>,
  },
  {
    name: 'Nivel/Categoría',
    selector: (row) => row.NivelCategoria,
    sortable: true,
    cell: (row) => <div className="p-2">{row.NivelCategoria}</div>,
  },
  {
    name: 'CI Tutor Legal',
    selector: (row) => row.CITutorLegal,
    sortable: true,
    cell: (row) => <div className="p-2">{row.CITutorLegal}</div>,
  },
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
    <div className="w-full">
      {data.length === 0 ? (
        <div className="text-center text-neutral2 body-lg p-4">
          Aún no hay olimpistas registrados.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pagination
          paginationPerPage={5}
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
