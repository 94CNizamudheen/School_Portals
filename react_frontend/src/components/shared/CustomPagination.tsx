import { Pagination,PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,} from "../../components/ui/pagination"

interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const MAX_VISIBLE_PAGES = 5;

export function CustomPagination({ currentPage, totalPages, onPageChange }: Props) {
  const createPageRange = () => {
    const range = [];
    const half = Math.floor(MAX_VISIBLE_PAGES / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    // Adjust start and end if near the boundaries
    if (end - start < MAX_VISIBLE_PAGES - 1) {
      if (start === 1) {
        end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
      } else if (end === totalPages) {
        start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
      }
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  const pageRange = createPageRange();

  return (
    <Pagination className="p-4">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>

        {/* First Page + Ellipsis if needed */}
        {pageRange[0] > 1 && (
          <>
            <PaginationItem >
              <PaginationLink href="#" onClick={(e) => {
                e.preventDefault();
                onPageChange(1);
              }}>
                1
              </PaginationLink>
            </PaginationItem>
            {pageRange[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis className="bg-gray-500" />
              </PaginationItem>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pageRange.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
            className="bg-gray-600 text-white hover:bg-gray-700"
              href="#"
              isActive={page === currentPage}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
              
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Last Page + Ellipsis if needed */}
        {pageRange[pageRange.length - 1] < totalPages && (
          <>
            {pageRange[pageRange.length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href="#" onClick={(e) => {
                e.preventDefault();
                onPageChange(totalPages);
              }}>
                {totalPages}
              </PaginationLink >
            </PaginationItem>
          </>
        )}

        {/* Next Button */}
        <PaginationItem >
          <PaginationNext 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
