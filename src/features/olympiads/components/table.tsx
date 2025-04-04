import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

interface Table {
  id: number;
  area: string;
  level: string;
  grade: string;
}

type TableRow = {
  id: number;
  area: string;
  level: string;
  grade: string;
};

type TableProps = {
  data: TableRow[];
};

export const Table: React.FC<TableProps> = ({ data }) => {
  const columns: TableColumn<TableRow>[] = [
    {
      name: 'Área',
      selector: (row: TableRow) => row.area,
      sortable: true,
      cell: (row) => <span className="text-onBack body-lg">{row.area}</span>,
    },
    {
      name: 'Nivel/Categoría',
      selector: (row: TableRow) => row.level,
      sortable: true,
      cell: (row) => <span className="text-onBack body-lg">{row.level}</span>,
    },
    {
      name: 'Grados',
      selector: (row: TableRow) => row.grade,
      sortable: true,
      cell: (row) => <span className="text-onBack body-lg">{row.grade}</span>,
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

  return (
    <div className="w-full flex items-center justify-center my-6">
      <div className="w-full">
        <div className="flex justify-between">
          <h2 className="text-primary subtitle-md">
            Niveles/Categorías registradas en área
          </h2>
        </div>
        <div className="max-h-[100px] overflow-y-auto">
          <DataTable
            title=""
            columns={columns}
            data={data}
            pagination
            responsive
            highlightOnHover
            customStyles={customStyles}
            noDataComponent={
              <span className="text-neutral2 body-lg">
                No hay niveles o categorías registradas
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
};
