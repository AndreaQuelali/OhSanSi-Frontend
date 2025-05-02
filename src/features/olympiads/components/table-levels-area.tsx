import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { CustomPagination } from '@/components';

interface TableRow {
  id: number;
  olympiad: string;
  area: string;
  level: string;
}

type TableProps = {
  data: TableRow[];
};

export const TableLevesArea: React.FC<TableProps> = ({ data }) => {
  const columns: TableColumn<TableRow>[] = [
    {
      name: 'Olimpiada',
      selector: (row) => row.olympiad,
      sortable: true,
      cell: (row) => (
        <span className="text-onBack body-lg">{row.olympiad}</span>
      ),
    },
    {
      name: 'Área',
      selector: (row) => row.area,
      sortable: true,
      cell: (row) => <span className="text-onBack body-lg">{row.area}</span>,
    },
    {
      name: 'Nivel/Categoría',
      selector: (row) => row.level,
      sortable: true,
      cell: (row) => <span className="text-onBack body-lg">{row.level}</span>,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontFamily: 'Lato, sans-serif',
        fontSize: '16px',
        fontWeight: '500',
        color: '#0e1217',
        justifyContent: 'center',
      },
    },
    cells: {
      style: {
        justifyContent: 'center',
      },
    },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-6">
      {data.length === 0 ? (
        <span className="text-neutral2 body-lg">
          No hay niveles o categorías registradas en áreas
        </span>
      ) : (
        <>
          <div className="w-full">
            <DataTable
              title=""
              columns={columns}
              data={data}
              pagination
              paginationPerPage={5}
              paginationComponent={CustomPagination}
              responsive
              highlightOnHover
              customStyles={customStyles}
              noHeader
            />
          </div>
        </>
      )}
    </div>
  );
};
