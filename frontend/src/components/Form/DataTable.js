import React from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'
import NoData from '../NoData'
import Button from './Button'
import Pagination from '../Pagination/Pagination'

const DataTable = ({
  columns = [],
  data = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onEdit,
  onDelete,
  enableActions = false,
  errorMessage,
  actionButtons = ['edit', 'delete'],
  totalItems = 0,
  itemsPerPage = 10,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(startIndex + data?.length - 1, totalItems)
console.log('DataTable Data:', data)

  return (
    <>
      {data?.length === 0 ? (
        <NoData message={errorMessage} />
      ) : (
        <>
          {/* Top Display Info */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="text-muted small">
              Showing {startIndex}–{endIndex} of {totalItems} entries
            </div>
          </div>

          {/* Table */}
          <CTable striped hover responsive align="middle">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>S.No.</CTableHeaderCell>
                {columns.map((col) => (
                  <CTableHeaderCell key={col.key}>{col.label}</CTableHeaderCell>
                ))}
                {enableActions && <CTableHeaderCell>Actions</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Array.isArray(data) &&
                data.map((item, index) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell>{startIndex + index}</CTableDataCell>
                    {columns.map((col, colIndex) => (
                      <CTableDataCell key={`${item._id}-${col.key || `col-${colIndex}`}`}>
                        {col.render ? col.render(item[col.key], item) : (item[col.key] ?? '-')}
                      </CTableDataCell>
                    ))}

                    {enableActions && (
                      <CTableDataCell>
                        <div className="d-flex gap-2">
                          {actionButtons.includes('edit') && (
                            <Button
                              title="Edit"
                              type="button"
                              color="success"
                              btnSmall
                              onClick={() => onEdit?.(item)}
                            />
                          )}
                          {actionButtons.includes('delete') && (
                            <Button
                              title="Delete"
                              type="button"
                              color="danger"
                              btnSmall
                              onClick={() => onDelete?.(item)}
                            />
                          )}
                        </div>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-3 d-flex justify-content-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DataTable
