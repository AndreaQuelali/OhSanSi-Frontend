import { useEffect, useState } from 'react';
import { PaginationComponentProps } from 'react-data-table-component';
import { ButtonIcon } from './button-icon';
import PreviewIcon from '../icons/icon-previw';
import NextIcon from '../icons/icon-next';
import { Button } from './button';

export const CustomPagination: React.FC<PaginationComponentProps> = ({
  currentPage,
  onChangePage,
  rowsPerPage,
  rowCount,
}) => {
  const totalPages = Math.ceil(rowCount / rowsPerPage);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onChangePage(page, rowCount);
    }
  };

  const renderPages = () => {
    const showPages = () => {
      const range: (number | string)[] = [];

      if (isMobile) {
        if (currentPage === 1) {
          const end = Math.min(totalPages, 3);
          for (let i = 1; i <= end; i++) {
            range.push(i);
          }
        } else if (currentPage === totalPages) {
          const start = Math.max(1, totalPages - 2);
          for (let i = start; i <= totalPages; i++) {
            range.push(i);
          }
        } else {
          const start = Math.max(1, currentPage - 1);
          const end = Math.min(totalPages, currentPage + 1);
          for (let i = start; i <= end; i++) {
            range.push(i);
          }
        }
      } else {
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        range.push(1);
        if (startPage > 2) range.push('...');

        for (let i = startPage; i <= endPage; i++) {
          range.push(i);
        }

        if (endPage < totalPages - 1) range.push('...');
        if (totalPages > 1) range.push(totalPages);
      }

      return range;
    };

    const visiblePages = showPages();

    return visiblePages.map((page, index) =>
      page === '...' ? (
        <span
          key={`ellipsis-${index}`}
          className="px-2 pt-2 subtitle-md text-primary"
        >
          ...
        </span>
      ) : (
        <Button
          key={page}
          label={page.toString()}
          onClick={() => handlePageChange(Number(page))}
          variantColor={currentPage === page ? 'variant1' : 'variant3'}
          className="rounded-full w-10 h-8 p-0 text-sm font-bold"
        />
      ),
    );
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center p-4 gap-1 flex-wrap">
      <ButtonIcon
        variantColor={currentPage === 1 ? 'variantDesactivate' : 'variant2'}
        icon={PreviewIcon}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {renderPages()}
      <ButtonIcon
        variantColor={
          currentPage === totalPages ? 'variantDesactivate' : 'variant2'
        }
        icon={NextIcon}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </div>
  );
};
