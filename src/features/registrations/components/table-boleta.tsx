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
  isForPDF?: boolean; 
};

export const TableBoleta: React.FC<TableProps> = ({ data, isForPDF = false }) => {
  const columns: TableColumn<TableRow>[] = [
    { name: 'CANTIDAD', selector: row => row.count, cell: row => <span className="text-onBack body-sm">{row.count}</span> },
    { name: 'CONCEPTO', selector: row => row.concept, cell: row => <span className="text-onBack body-sm">{row.concept}</span> },
    { name: 'P.UNITARIO', selector: row => row.money, cell: row => <span className="text-onBack body-sm">{row.money}</span> },
  ];

  const customStyles = {
    headCells: { style: { justifyContent: 'center', fontWeight: 500, fontSize: '14px' } },
    cells: { style: { justifyContent: 'center' } },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-6">
      {data.length === 0 ? (
        <span className="text-neutral2 body-lg">No se encuentran datos de inscripción</span>
      ) : (
        <div className="w-full">
          <DataTable
            title=""
            columns={columns}
            data={data}
            pagination={!isForPDF} 
            paginationPerPage={2}
            paginationComponent={CustomPagination}
            responsive
            customStyles={customStyles}
            noHeader
          />
        </div>
      )}
    </div>
  );
};