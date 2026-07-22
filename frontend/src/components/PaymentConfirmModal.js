import React, { useCallback, useEffect, useState } from 'react'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTaxes, updateTax } from '../actions/orderActions'
import { TAX_CONSTANTS } from '../constants/taxConstants'
import Constants from '../utils/constants'
import { getDateTimeFromDateString } from '../helpers/Date'
import { removeSpaces, removeUnderScoreAndCapitalize } from '../helpers/strings'
import { showToast } from '../utils/toast'
import Button from './Form/Button'
import PaymentPendingFilters from './PaymentPendingFilters'

const PaymentConfirmModal = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { taxes } = useSelector((state) => state.allTaxes)
  const { loading: updateTaxLoading, success, tax: updatedTax, error: updateTaxError } =
    useSelector((state) => state.updateTax || {})

  const canConfirmPayment =
    user?.role === Constants.ROLES.ADMIN || Boolean(user?.canConfirmPayment)

  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [confirmingId, setConfirmingId] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [searchFilters, setSearchFilters] = useState({})

  const pendingTaxes =
    taxes?.filter((t) => t.status === Constants.ORDER_STATUS.PAYMENT_PENDING) || []

  const fetchPending = useCallback(
    (filters = searchFilters) => {
      dispatch(
        getAllTaxes({
          status: Constants.ORDER_STATUS.PAYMENT_PENDING,
          sort: 'asc',
          perPage: 100,
          ...filters,
        })
      )
    },
    [dispatch, searchFilters]
  )

  useEffect(() => {
    if (!canConfirmPayment) return

    fetchPending()
    const interval = setInterval(() => fetchPending(), 10000)
    return () => clearInterval(interval)
  }, [canConfirmPayment, fetchPending])

  useEffect(() => {
    if (!canConfirmPayment) return

    if (pendingTaxes.length > 0 && !dismissed) {
      setVisible(true)
    }
    if (pendingTaxes.length === 0) {
      setVisible(false)
      setDismissed(false)
    }
  }, [pendingTaxes.length, dismissed, canConfirmPayment])

  useEffect(() => {
    if (!success || !updatedTax?._id) return

    if (updatedTax.status === Constants.ORDER_STATUS.CONFIRMED) {
      showToast('Payment confirmed successfully')
      setConfirmingId(null)
      setConfirmTarget(null)
      fetchPending()
    }

    dispatch({ type: TAX_CONSTANTS.UPDATE_TAX_RESET })
  }, [success, updatedTax, dispatch, fetchPending])

  useEffect(() => {
    if (updateTaxError) {
      showToast(updateTaxError, 'error')
      setConfirmingId(null)
      dispatch({ type: TAX_CONSTANTS.UPDATE_TAX_RESET })
    }
  }, [updateTaxError, dispatch])

  const handleConfirmRequest = (tax) => {
    setConfirmTarget(tax)
  }

  const handleConfirmPayment = () => {
    if (!confirmTarget?._id) return

    setConfirmingId(confirmTarget._id)
    dispatch(
      updateTax(confirmTarget._id, {
        status: Constants.ORDER_STATUS.CONFIRMED,
        paymentStatus: 'completed',
      })
    )
  }

  const handleSearch = (filters) => {
    setSearchFilters(filters)
    dispatch(
      getAllTaxes({
        status: Constants.ORDER_STATUS.PAYMENT_PENDING,
        sort: 'asc',
        perPage: 100,
        ...filters,
      })
    )
  }

  const handleClearFilters = () => {
    setSearchFilters({})
    dispatch(
      getAllTaxes({
        status: Constants.ORDER_STATUS.PAYMENT_PENDING,
        sort: 'asc',
        perPage: 100,
      })
    )
  }

  const handleDismiss = () => {
    setVisible(false)
    setDismissed(true)
    setConfirmTarget(null)
  }

  const handleReopen = () => {
    setDismissed(false)
    setVisible(true)
  }

  if (!canConfirmPayment) return null

  return (
    <>
      {pendingTaxes.length > 0 && dismissed && !visible && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center mb-3">
          <span>
            <strong>{pendingTaxes.length}</strong> payment
            {pendingTaxes.length === 1 ? '' : 's'} awaiting confirmation
          </span>
          <Button btnSmall title="Review Payments" color="warning" onClick={handleReopen} />
        </div>
      )}

      <CModal visible={visible} onClose={handleDismiss} size="lg" scrollable>
        <CModalHeader>
          <CModalTitle className="d-flex align-items-center gap-2">
            Confirm UPI Payments
            <CBadge color="warning" shape="rounded-pill">
              {pendingTaxes.length}
            </CBadge>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <PaymentPendingFilters
            compact
            user={user}
            onSearch={handleSearch}
            onClear={handleClearFilters}
          />

          {pendingTaxes.length === 0 ? (
            <p className="text-muted mb-0">No payment pending orders.</p>
          ) : (
            <>
              <p className="text-muted small mb-3">
                Verify the UPI payment in your bank account, then confirm each order below.
              </p>
              <CTable hover responsive align="middle" className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Vehicle</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Category</CTableHeaderCell>
                    <CTableHeaderCell>Payment</CTableHeaderCell>
                    <CTableHeaderCell>Created</CTableHeaderCell>
                    <CTableHeaderCell className="text-end">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {pendingTaxes.map((tax) => {
                    const isConfirming = confirmingId === tax._id && updateTaxLoading
                    const paymentLabel =
                      tax.paymentMethod === 'upi'
                        ? `UPI ₹${tax.gatewayAmountPaid || tax.amount}`
                        : tax.paymentMethod === 'wallet' && tax.gatewayAmountPaid > 0
                        ? `Wallet + UPI ₹${tax.gatewayAmountPaid}`
                        : removeUnderScoreAndCapitalize(tax.paymentMethod || 'UPI')

                    return (
                      <CTableRow key={tax._id}>
                        <CTableDataCell className="fw-semibold">
                          {removeSpaces(tax.vehicleNumber)}
                        </CTableDataCell>
                        <CTableDataCell>₹{tax.amount}</CTableDataCell>
                        <CTableDataCell>
                          {removeUnderScoreAndCapitalize(tax.category)}
                        </CTableDataCell>
                        <CTableDataCell className="small">{paymentLabel}</CTableDataCell>
                        <CTableDataCell className="small text-muted">
                          {getDateTimeFromDateString(tax.createdAt)}
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          <Button
                            btnSmall
                            title={isConfirming ? 'Confirming...' : 'Confirm'}
                            color="success"
                            disabled={isConfirming}
                            onClick={() => handleConfirmRequest(tax)}
                          />
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <Button btnSmall title="Dismiss" color="secondary" onClick={handleDismiss} />
        </CModalFooter>
      </CModal>

      <CModal
        visible={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Confirm Payment</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {confirmTarget && (
            <>
              <p className="mb-2">
                Are you sure you want to mark this payment as completed?
              </p>
              <ul className="small text-muted mb-0">
                <li>
                  <strong>Vehicle:</strong> {removeSpaces(confirmTarget.vehicleNumber)}
                </li>
                <li>
                  <strong>Amount:</strong> ₹{confirmTarget.amount}
                </li>
                <li>
                  <strong>Category:</strong>{' '}
                  {removeUnderScoreAndCapitalize(confirmTarget.category)}
                </li>
              </ul>
              <p className="small text-danger mt-3 mb-0">
                Only confirm if you have verified the UPI payment in your bank account.
              </p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <Button
            btnSmall
            title="Cancel"
            color="secondary"
            onClick={() => setConfirmTarget(null)}
          />
          <Button
            btnSmall
            title={updateTaxLoading ? 'Confirming...' : 'Yes, Confirm Payment'}
            color="success"
            disabled={updateTaxLoading}
            onClick={handleConfirmPayment}
          />
        </CModalFooter>
      </CModal>
    </>
  )
}

export default PaymentConfirmModal
