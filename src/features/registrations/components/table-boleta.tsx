import DataTable, { TableColumn } from 'react-data-table-component';
import { CustomPagination } from '@/components';

interface TableRow {
  id: number;
  count: string;
  concept: string;
  money: string;
}

type TableProps = {
  data: TableRow[];
};

export const TableBoleta: React.FC<TableProps> = ({ data }) => {
  const columns: TableColumn<TableRow>[] = [
    {
      name: 'Nº',
      selector: (row) => row.count,
      sortable: false,
      cell: (row) => <span className="text-onBack body-sm">{row.count}</span>,
    },
    {
      name: 'CONCEPTO',
      selector: (row) => row.concept,
      sortable: false,
      cell: (row) => <span className="text-onBack body-sm">{row.concept}</span>,
    },
    {
      name: 'P.UNITARIO',
      selector: (row) => row.money,
      sortable: false,
      cell: (row) => <span className="text-onBack body-sm">{row.money}</span>,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontFamily: 'Lato, sans-serif',
        fontSize: '14px',
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
          No se encuentran datos de incripción
        </span>
      ) : (
        <>
          <div className="w-full">
            <DataTable
              title=""
              columns={columns}
              data={data}
              pagination
              paginationPerPage={2}
              paginationComponent={CustomPagination}
              responsive
              customStyles={customStyles}
              noHeader
            />
          </div>
        </>
      )}
    </div>
  );
};
