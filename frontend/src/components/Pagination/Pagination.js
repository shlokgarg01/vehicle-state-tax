import { CPagination, CPaginationItem } from '@coreui/react'

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  //   const maxPageNumbersToShow = 5 // Number of pages to show before truncating

  // Generate page numbers with truncation logic
  const getPageNumbers = () => {
    const pages = []
    const startPage = Math.max(2, currentPage - 2)
    const endPage = Math.min(totalPages - 1, currentPage + 2)

    if (startPage > 2) pages.push('...')
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    if (endPage < totalPages - 1) pages.push('...')

    return pages
  }

  return (
    <CPagination size="sm" className="justify-content-end text-secondary">
      {/* Previous Button */}
      <CPaginationItem disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </CPaginationItem>

      {/* First Page */}
      <CPaginationItem active={currentPage === 1} onClick={() => onPageChange(1)}>
        1
      </CPaginationItem>

      {/* Dynamic Pages */}
      {getPageNumbers().map((page, index) => (
        <CPaginationItem
          key={index}
          active={page === currentPage}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
        >
          {page}
        </CPaginationItem>
      ))}

      {/* Last Page */}
      {totalPages > 1 && (
        <CPaginationItem
          active={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </CPaginationItem>
      )}

      {/* Next Button */}
      <CPaginationItem
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </CPaginationItem>
    </CPagination>
  )
}

export default Pagination
