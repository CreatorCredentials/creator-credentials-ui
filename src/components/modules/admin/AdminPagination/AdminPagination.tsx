import { Pagination } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';

type AdminPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export const AdminPagination = ({
  page,
  pageSize,
  total,
  onPageChange,
}: AdminPaginationProps) => {
  const { t } = useTranslation('admin');
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p
        className="text-sm text-grey-4"
        data-testid="admin-pagination-summary"
      >
        {t('pagination.summary', {
          from: String(from),
          to: String(to),
          total: String(total),
        })}
      </p>
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          previousLabel={t('pagination.previous')}
          nextLabel={t('pagination.next')}
          showIcons
          data-testid="admin-pagination"
        />
      )}
    </div>
  );
};
