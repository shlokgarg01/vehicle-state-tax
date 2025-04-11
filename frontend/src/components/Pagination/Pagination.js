import { CPagination, CPaginationItem } from '@coreui/react'

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
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
      <CPaginationItem
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
      >
        Previous
      </CPaginationItem>

      <CPaginationItem
        active={currentPage === 1}
        onClick={() => onPageChange(1)}
        style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
      >
        1
      </CPaginationItem>

      {getPageNumbers().map((page, index) => (
        <CPaginationItem
          key={index}
          active={page === currentPage}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          style={{ cursor: typeof page === 'number' ? 'pointer' : 'default' }}
        >
          {page}
        </CPaginationItem>
      ))}

      {totalPages > 1 && (
        <CPaginationItem
          active={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          style={{ cursor: currentPage === totalPages ? 'default' : 'pointer' }}
        >
          {totalPages}
        </CPaginationItem>
      )}

      <CPaginationItem
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
      >
        Next
      </CPaginationItem>
    </CPagination>
  )
}

export default Pagination
