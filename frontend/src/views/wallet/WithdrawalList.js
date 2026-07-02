/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CBadge,
  CButton,
  CForm,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCopy, cilCloudDownload } from '@coreui/icons'
import Modal from '../../components/Modal/Modal'
import Pagination from '../../components/Pagination/Pagination'
import NoData from '../../components/NoData'
import Loader from '../../components/Loader/Loader'
import TextArea from '../../components/Form/TextArea'
import DateSelector from '../../components/Form/DateSelector'
import Button from '../../components/Form/Button'
import { showToast } from '../../utils/toast'
import { getDateTimeFromDateString } from '../../helpers/Date'
import { removeUnderScoreAndCapitalize } from '../../helpers/strings'
import {
  getWithdrawals,
  completeWithdrawal,
  rejectWithdrawal,
} from '../../actions/walletAction'
import { WALLET_CONSTANTS } from '../../constants/walletConstants'
import Constants from '../../utils/constants'
import UpiPaymentQr from '../../components/UpiPaymentQr'

const STATUS_FILTERS = [
  { label: 'All', value: '', countKey: 'all' },
  { label: 'Pending', value: 'pending', countKey: 'pending' },
  { label: 'Completed', value: 'completed', countKey: 'completed' },
  { label: 'Rejected', value: 'rejected', countKey: 'rejected' },
]

const statusBadgeColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'completed':
      return 'success'
    case 'rejected':
      return 'danger'
    default:
      return 'secondary'
  }
}

const copyText = (text) => {
  if (!text) return
  if (navigator.clipboard) {
    navigator.clipboard.writeText(String(text))
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = String(text)
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
  showToast('Copied', 'success', 500)
}

const CopyBtn = ({ value }) => (
  <CIcon
    icon={cilCopy}
    size="sm"
    className="text-muted ms-1"
    style={{ cursor: 'pointer' }}
    onClick={() => copyText(value)}
    title="Copy"
  />
)

const DetailLine = ({ label, value, copyable }) => {
  if (!value) return null
  return (
    <div className="d-flex align-items-center gap-1 mb-1">
      <span className="text-muted" style={{ minWidth: 70, fontSize: '0.75rem' }}>
        {label}
      </span>
      <span className="text-dark" style={{ fontSize: '0.8125rem' }}>
        {value}
      </span>
      {copyable && <CopyBtn value={value} />}
    </div>
  )
}

const getPayoutAmount = (withdrawal) =>
  withdrawal?.payoutAmount ?? withdrawal?.amount ?? 0

const getWalletDebitAmount = (withdrawal) =>
  withdrawal?.walletDebitAmount ?? withdrawal?.amount ?? 0

const WithdrawalAmountCell = ({ withdrawal }) => {
  const payoutAmount = getPayoutAmount(withdrawal)
  const walletDebitAmount = getWalletDebitAmount(withdrawal)
  const hasDeduction = walletDebitAmount > payoutAmount

  return (
    <div>
      <div className="fw-semibold">₹{payoutAmount}</div>
      {hasDeduction && (
        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
          Wallet debit ₹{walletDebitAmount}
          {withdrawal.deductionAmount > 0 && ` · Fee ₹${withdrawal.deductionAmount}`}
        </div>
      )}
    </div>
  )
}

const PayoutDetails = ({ bank = {}, amount, requestId, showQr = false }) => {
  const hasBank = Boolean(bank.accountNumber)
  const hasUpi = Boolean(bank.upiId)

  if (!hasBank && !hasUpi) {
    return <span className="text-muted small">—</span>
  }

  const qrNote = requestId ? `Withdrawal ${requestId}` : 'Wallet withdrawal'

  if (hasUpi && !hasBank) {
    return (
      <div>
        <div className="text-muted fw-semibold mb-1" style={{ fontSize: '0.7rem' }}>
          UPI
        </div>
        <DetailLine label="UPI ID" value={bank.upiId} copyable />
        {showQr && (
          <UpiPaymentQr
            upiId={bank.upiId}
            amount={amount}
            payeeName={bank.accountHolderName}
            note={qrNote}
            size={120}
          />
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="text-muted fw-semibold mb-1" style={{ fontSize: '0.7rem' }}>
        Bank Account
      </div>
      <DetailLine label="Name" value={bank.accountHolderName} copyable />
      <DetailLine label="Bank" value={bank.bankName} />
      <DetailLine label="A/C No." value={bank.accountNumber} copyable />
      <DetailLine label="IFSC" value={bank.ifscCode} copyable />
      {hasUpi && <DetailLine label="UPI" value={bank.upiId} copyable />}
      {showQr && hasUpi && (
        <UpiPaymentQr
          upiId={bank.upiId}
          amount={amount}
          payeeName={bank.accountHolderName}
          note={qrNote}
          size={120}
        />
      )}
    </div>
  )
}

export default function WithdrawalList() {
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [appliedDateFilters, setAppliedDateFilters] = useState({ startDate: '', endDate: '' })
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [proofFile, setProofFile] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const { withdrawals, totalPages, total, counts, totalRefunded, perPage, loading, error } =
    useSelector((state) => state.withdrawals)
  const {
    loading: completeLoading,
    success: completeSuccess,
    error: completeError,
  } = useSelector((state) => state.completeWithdrawal)
  const {
    loading: rejectLoading,
    success: rejectSuccess,
    error: rejectError,
  } = useSelector((state) => state.rejectWithdrawal)

  const fetchWithdrawals = useCallback(() => {
    dispatch(
      getWithdrawals({
        page,
        perPage: Constants.ITEMS_PER_PAGE,
        status: statusFilter,
        startDate: appliedDateFilters.startDate,
        endDate: appliedDateFilters.endDate,
      })
    )
  }, [dispatch, page, statusFilter, appliedDateFilters])

  useEffect(() => {
    fetchWithdrawals()
  }, [fetchWithdrawals])

  useEffect(() => {
    if (completeSuccess) {
      showToast('Withdrawal marked as completed')
      setShowCompleteModal(false)
      setProofFile(null)
      setSelectedWithdrawal(null)
      dispatch({ type: WALLET_CONSTANTS.COMPLETE_WITHDRAWAL_RESET })
      fetchWithdrawals()
    }
    if (completeError) {
      showToast(completeError, 'error')
      dispatch({ type: WALLET_CONSTANTS.COMPLETE_WITHDRAWAL_RESET })
    }
  }, [completeSuccess, completeError])

  useEffect(() => {
    if (rejectSuccess) {
      showToast('Withdrawal rejected')
      setShowRejectModal(false)
      setRejectionReason('')
      setSelectedWithdrawal(null)
      dispatch({ type: WALLET_CONSTANTS.REJECT_WITHDRAWAL_RESET })
      fetchWithdrawals()
    }
    if (rejectError) {
      showToast(rejectError, 'error')
      dispatch({ type: WALLET_CONSTANTS.REJECT_WITHDRAWAL_RESET })
    }
  }, [rejectSuccess, rejectError])

  useEffect(() => {
    if (error) showToast(error, 'error')
  }, [error])

  const handleComplete = () => {
    if (!proofFile) {
      showToast('Please upload payment proof screenshot', 'error')
      return
    }
    const formData = new FormData()
    formData.append('proofScreenshot', proofFile)
    dispatch(completeWithdrawal(selectedWithdrawal._id, formData))
  }

  const handleDateSearch = (e) => {
    e.preventDefault()
    setAppliedDateFilters({ startDate, endDate })
    setPage(1)
  }

  const handleDateClear = () => {
    setStartDate('')
    setEndDate('')
    setAppliedDateFilters({ startDate: '', endDate: '' })
    setPage(1)
  }

  const hasDateFilter = Boolean(appliedDateFilters.startDate || appliedDateFilters.endDate)

  const handleReject = () => {
    dispatch(rejectWithdrawal(selectedWithdrawal._id, rejectionReason))
  }

  const itemsPerPage = perPage || Constants.ITEMS_PER_PAGE

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="border-0 shadow-sm">
          <CCardBody className="p-3 p-md-4">
            <div className="mb-3">
              <h5 className="mb-2">Wallet Withdrawals</h5>
              <div className="d-flex flex-wrap align-items-center gap-3 small">
                <span className="text-muted">
                  {total || 0} request{total === 1 ? '' : 's'}
                  {hasDateFilter ? ' in selected range' : ''}
                </span>
                <span className="text-success fw-semibold">
                  Total refunded: ₹{totalRefunded ?? 0}
                </span>
              </div>
            </div>

            <div className="rounded border bg-light p-3 mb-3">
              <div className="d-flex flex-column flex-md-row flex-md-wrap align-items-md-center justify-content-md-between gap-2 mb-3 pb-3 border-bottom">
                <span className="small text-muted fw-semibold mb-0">Status</span>
                <div className="btn-group btn-group-sm flex-wrap">
                  {STATUS_FILTERS.map(({ label, value, countKey }) => {
                    const isActive = statusFilter === value
                    const count = counts?.[countKey]
                    return (
                      <CButton
                        key={value || 'all'}
                        color={isActive ? 'dark' : 'light'}
                        className={isActive ? '' : 'text-muted border'}
                        onClick={() => {
                          setStatusFilter(value)
                          setPage(1)
                        }}
                      >
                        {label}
                        {count !== undefined && ` (${count})`}
                      </CButton>
                    )
                  })}
                </div>
              </div>

              <CForm onSubmit={handleDateSearch}>
                <div className="d-flex flex-column flex-lg-row align-items-lg-end gap-3">
                  <div className="flex-grow-1" style={{ maxWidth: '180px' }}>
                    <label htmlFor="withdrawalStartDate" className="form-label small text-muted mb-1">
                      From
                    </label>
                    <DateSelector
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      id="withdrawalStartDate"
                    />
                  </div>
                  <div className="flex-grow-1" style={{ maxWidth: '180px' }}>
                    <label htmlFor="withdrawalEndDate" className="form-label small text-muted mb-1">
                      To
                    </label>
                    <DateSelector
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      id="withdrawalEndDate"
                    />
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0">
                    <Button title="Apply" type="submit" color="dark" btnSmall />
                    <Button title="Clear" type="button" color="danger" btnSmall onClick={handleDateClear} />
                  </div>
                </div>
              </CForm>
            </div>

            {loading ? (
              <Loader />
            ) : withdrawals?.length ? (
              <>
                <CTable hover responsive align="middle" className="mb-0 small">
                  <CTableHead className="text-muted">
                    <CTableRow>
                      <CTableHeaderCell style={{ width: 56 }}>S.No</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                      <CTableHeaderCell>User</CTableHeaderCell>
                      <CTableHeaderCell>Amount</CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: 200 }}>Bank / UPI</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {withdrawals.map((w, index) => (
                      <CTableRow key={w._id}>
                        <CTableDataCell className="text-muted">
                          {(page - 1) * itemsPerPage + index + 1}
                        </CTableDataCell>
                        <CTableDataCell className="text-nowrap">
                          {getDateTimeFromDateString(w.createdAt)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {w.userId?.contactNumber || '—'}
                          {w.userId?.contactNumber && <CopyBtn value={w.userId.contactNumber} />}
                        </CTableDataCell>
                        <CTableDataCell>
                          <WithdrawalAmountCell withdrawal={w} />
                        </CTableDataCell>
                        <CTableDataCell style={{ minWidth: 200, verticalAlign: 'top' }}>
                          <PayoutDetails bank={w.bankDetails} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={statusBadgeColor(w.status)} className="fw-normal">
                            {removeUnderScoreAndCapitalize(w.status)}
                          </CBadge>
                          {w.status === 'rejected' && w.rejectionReason && (
                            <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                              {w.rejectionReason}
                            </div>
                          )}
                          {w.processedBy?.username && (
                            <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                              by {w.processedBy.username}
                            </div>
                          )}
                        </CTableDataCell>
                        <CTableDataCell className="text-end text-nowrap">
                          {w.status === 'pending' ? (
                            <div className="d-inline-flex gap-1">
                              <CButton
                                color="dark"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedWithdrawal(w)
                                  setShowCompleteModal(true)
                                }}
                              >
                                Complete
                              </CButton>
                              <CButton
                                color="secondary"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedWithdrawal(w)
                                  setShowRejectModal(true)
                                }}
                              >
                                Reject
                              </CButton>
                            </div>
                          ) : w.proofScreenshotUrl ? (
                            <a
                              href={w.proofScreenshotUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-link text-decoration-none p-0"
                            >
                              <CIcon icon={cilCloudDownload} size="sm" className="me-1" />
                              Proof
                            </a>
                          ) : (
                            '—'
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-end mt-3">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <NoData message="No withdrawal requests found" />
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <Modal
        visible={showCompleteModal}
        onVisibleToggle={() => setShowCompleteModal(false)}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Withdrawal"
        body={
          <div>
            <p className="mb-2 small">
              Upload payment proof for{' '}
              <strong>₹{getPayoutAmount(selectedWithdrawal)}</strong>
              {getWalletDebitAmount(selectedWithdrawal) >
                getPayoutAmount(selectedWithdrawal) && (
                <span className="text-muted">
                  {' '}
                  (wallet debit ₹{getWalletDebitAmount(selectedWithdrawal)})
                </span>
              )}
            </p>
            {selectedWithdrawal?.bankDetails && (
              <div className="mb-3 p-2 rounded border bg-light small">
                <PayoutDetails
                  bank={selectedWithdrawal.bankDetails}
                  amount={getPayoutAmount(selectedWithdrawal)}
                  requestId={selectedWithdrawal._id}
                  showQr={Boolean(selectedWithdrawal.bankDetails?.upiId)}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) => setProofFile(e.target.files[0])}
              className="form-control form-control-sm"
            />
          </div>
        }
        closeBtnText="Cancel"
        submitBtnText={completeLoading ? 'Uploading...' : 'Mark Complete'}
        submitBtnColor="dark"
        onSubmitBtnClick={handleComplete}
      />

      <Modal
        visible={showRejectModal}
        onVisibleToggle={() => setShowRejectModal(false)}
        onClose={() => setShowRejectModal(false)}
        title="Reject Withdrawal"
        body={
          <TextArea
            label="Rejection Reason (optional)"
            name="rejectionReason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        }
        closeBtnText="Cancel"
        submitBtnText={rejectLoading ? 'Rejecting...' : 'Reject'}
        submitBtnColor="danger"
        onSubmitBtnClick={handleReject}
      />
    </CRow>
  )
}
