import { CustomPagination } from '@/components';
import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
interface TableRow {
  Nombre: string;
  Apellido: string;
  Departamento: string;
  Provincia: string;
  UnidadEducativa: string;
  Grado: string;
  Area: string;
  NivelCategoria: string;
}

type TableProps = {
  data: TableRow[];
};

const columns: TableColumn<TableRow>[] = [
  { name: 'Nombre(s)', selector: (row) => row.Nombre, sortable: true },
  { name: 'Apellido(s)', selector: (row) => row.Apellido, sortable: true },
  { name: 'Departamento', selector: (row) => row.Departamento, sortable: true },
  { name: 'Provincia', selector: (row) => row.Provincia, sortable: true },
  {
    name: 'Unidad Educativa',
    selector: (row) => row.UnidadEducativa,
    sortable: true,
  },
  { name: 'Grado', selector: (row) => row.Grado, sortable: true },

  { name: 'Área', selector: (row) => row.Area, sortable: true },
  {
    name: 'Nivel/Categoría',
    selector: (row) => row.NivelCategoria,
    sortable: true,
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

export const TableRegisterOli: React.FC<TableProps> = ({ data }) => {
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
          responsive
          customStyles={customStyles}
          noHeader
        />
      )}
    </div>
  );
};
