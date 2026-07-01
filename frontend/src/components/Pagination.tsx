interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-3 mt-8">
      <button
        className="inline-flex items-center px-4 py-2 rounded-xl font-semibold text-[14px] cursor-pointer transition-all duration-200 bg-white/5 text-gray-100 border border-white/8 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>
      <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
      <button
        className="inline-flex items-center px-4 py-2 rounded-xl font-semibold text-[14px] cursor-pointer transition-all duration-200 bg-white/5 text-gray-100 border border-white/8 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
