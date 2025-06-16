import { CustomPagination } from '@/components';
import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

interface TableRow {
  id: number;
  area: string;
}

type TableProps = {
  data: TableRow[];
};

const columns: TableColumn<TableRow>[] = [
  {
    name: 'Área',
    selector: (row) => row.area,
    sortable: true,
    cell: (row) => <div className="text-center w-full p-4">{row.area}</div>,
  },
];

const customStyles = {
  headCells: {
    style: {
      fontFamily: 'Lato, sans-serif',
      fontSize: '16px',
      fontWeight: '500',
      color: '#26326c',
      justifyContent: 'center',
    },
  },
};

export const TableAreas: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="w-full">
      {data.length === 0 ? (
        <div className="text-center text-neutral2 body-lg p-4">
          Aún no hay áreas registradas.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pagination
          customStyles={customStyles}
          paginationPerPage={3}
          paginationComponent={CustomPagination}
          noHeader
          responsive
          highlightOnHover
        />
      )}
    </div>
  );
};
