/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { CCard, CCardBody, CRow, CCol, CContainer } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibWhatsapp,
  cilCloudDownload,
  cilCloudUpload,
  cilCopy,
  cilPhone,
} from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { resendTaxWhatsApp, updateTax, uploadTax } from '../../actions/orderActions'
import { refundTaxToWallet } from '../../actions/walletAction'
import { WALLET_CONSTANTS } from '../../constants/walletConstants'
import { removeSpaces, removeUnderScoreAndCapitalize } from '../../helpers/strings'
import { showToast } from '../../utils/toast'
import { TAX_CONSTANTS } from '../../constants/taxConstants'
import { getDateFromDateString, getDateTimeFromDateString } from '../../helpers/Date'
import CONSTANTS from '../../utils/constants'
import Modal from '../../components/Modal/Modal'

const FieldRow = ({ label, value, copyable, isPhone }) => {
  if (!value) return null
  const [showFullPhone, setShowFullPhone] = useState(false)

  const normalizedValue = String(value)
  const maskedPhoneNumber = `***${normalizedValue.slice(-4)}`
  const displayedValue = isPhone && !showFullPhone ? maskedPhoneNumber : normalizedValue

  const copyTextFallback = (text) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed' // Avoid scrolling to bottom
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {}
    document.body.removeChild(textArea)
  }

  const handleCopy = () => {
    navigator.clipboard
      ? navigator.clipboard.writeText(normalizedValue)
      : copyTextFallback(normalizedValue) // navigator.clipboard is null on apps deployed on HTTP, so in our case we were not able to copy on production, but it works on localhost. Hence using a fallback way.
    showToast('Copied', 'success', 500)
  }

  const handleCall = () => {
    window.open(`tel:${normalizedValue}`, '_self')
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${normalizedValue}`, '_blank')
  }

  return (
    <div className="d-flex flex-column">
      <strong className="text-dark">{label}</strong>
      <div className="d-flex align-items-center text-muted">
        <span className="me-2 small">{displayedValue}</span>
        {copyable && (
          <CIcon
            icon={cilCopy}
            size="md"
            style={{ cursor: 'pointer' }}
            onClick={handleCopy}
            className="me-1"
            title="Copy"
          />
        )}
        {isPhone && (
          <span
            role="button"
            aria-label={showFullPhone ? 'Hide Number' : 'Show Number'}
            title={showFullPhone ? 'Hide Number' : 'Show Number'}
            onClick={() => setShowFullPhone((prev) => !prev)}
            className="me-1 d-inline-flex align-items-center"
            style={{ cursor: 'pointer', marginLeft: 5 }}
          >
            {showFullPhone ? (
              // Eye-off icon (hidden state)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.77 21.77 0 0 1 5.06-7.94" />
                <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.68 21.68 0 0 1-3.17 5.17" />
                <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // Eye icon (shown state)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </span>
        )}
        {isPhone && (
          <>
            <CIcon
              icon={cilPhone}
              size="md"
              style={{ cursor: 'pointer', color: '#007bff' , marginLeft: 5 }}
              onClick={handleCall}
              className="me-1"
              title="Call"
            />
            <CIcon
              icon={cibWhatsapp}
              size="md"
              style={{ cursor: 'pointer', color: '#25D366' , marginLeft: 5 }}
              onClick={handleWhatsApp}
              title="Open WhatsApp"
            />
          </>
        )}
      </div>
    </div>
  )
}

const TaxCard = ({ data, onUploadComplete, onRefundComplete, setIsUploading, showStatus }) => {
  const dispatch = useDispatch()
  const { user: loggedInUser } = useSelector((state) => state.user)
  const canViewContactNumber = Boolean(loggedInUser?.canViewContactNumber)
  const canRefundToWallet =
    loggedInUser?.role === CONSTANTS.ROLES.ADMIN || Boolean(loggedInUser?.canRefund)
  const fileInputRef = useRef(null)
  const [localFileUrl, setLocalFileUrl] = useState(data.fileUrl)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundPassword, setRefundPassword] = useState('')
  const [showMarkRefundedModal, setShowMarkRefundedModal] = useState(false)
  const whatsappSent = data?.isWhatsAppNotificationSent

  const {
    loading: uploadLoading,
    uploaded,
    error: uploadError,
  } = useSelector((state) => state.uploadTax || {})
  const { loading: updateTaxLoading, success, tax: updatedTax } = useSelector((state) => state.updateTax)
  const {
    loading: refundLoading,
    success: refundSuccess,
    tax: refundedTax,
    error: refundError,
    currentTaxId: refundTaxId,
  } = useSelector((state) => state.refundToWallet || {})
  const {
    loading: sendWhatsAppLoading,
    success: sendWhatsAppSuccess,
    error: sendWhatsAppError,
    message: sendWhatsAppMessage,
    currentOrderId: sendWhatsAppOrderId,
  } = useSelector((state) => state.sendWhatsApp || {})

  useEffect(() => {
    setLocalFileUrl(data.fileUrl)
  }, [data.fileUrl])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      showToast('Only PDF, JPG or PNG files allowed', 'error')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('orderId', data.orderId)

    setIsUploading?.(true)
    dispatch(uploadTax(formData))
  }

  const handleCancelConfirm = () => {
    dispatch(updateTax(data._id, { status: CONSTANTS.ORDER_STATUS.CANCELLED }))
    setShowCancelModal(false)
  }

  const handleRefundToWalletConfirm = () => {
    if (!refundPassword.trim()) {
      showToast('Please enter the refund password', 'error')
      return
    }
    dispatch(refundTaxToWallet(data._id, refundPassword.trim()))
    setShowRefundModal(false)
    setRefundPassword('')
  }

  const handleMarkAmountRefunded = () => {
    dispatch(updateTax(data._id, { isAmountRefunded: true }))
    setShowMarkRefundedModal(false)
  }

  useEffect(() => {
    if (success && updatedTax._id === data._id) {
      showToast('Tax Updated successfully')
      dispatch({ type: TAX_CONSTANTS.UPDATE_TAX_RESET })
    }

    if (refundSuccess && refundedTax?._id === data._id) {
      showToast('Full amount refunded to user wallet')
      dispatch({ type: WALLET_CONSTANTS.REFUND_TO_WALLET_RESET })
      onRefundComplete?.()
    }

    if (refundError && refundTaxId === data._id) {
      showToast(refundError, 'error')
      dispatch({ type: WALLET_CONSTANTS.REFUND_TO_WALLET_RESET })
    }

    const isThisCard = sendWhatsAppOrderId === data.orderId
    if (sendWhatsAppSuccess && isThisCard) {
      showToast(sendWhatsAppMessage || 'WhatsApp notification sent')
      dispatch({ type: TAX_CONSTANTS.SEND_WHATSAPP_RESET })
    }

    if (sendWhatsAppError && isThisCard) {
      showToast(sendWhatsAppError, 'error')
      dispatch({ type: TAX_CONSTANTS.SEND_WHATSAPP_RESET })
    }

    if (uploadError) {
      showToast(uploadError, 'error')
      setIsUploading?.(false)
    }

    if (uploaded) {
      dispatch({ type: TAX_CONSTANTS.UPLOAD_TAX_RESET })

      if (fileInputRef.current) fileInputRef.current.value = ''

      const uploadedFile = fileInputRef.current?.files?.[0]
      if (data?.fileUrl) {
        setLocalFileUrl(data.fileUrl)
      } else if (uploadedFile) {
        const fakeUrl = URL.createObjectURL(uploadedFile)
        setLocalFileUrl(fakeUrl)
        setTimeout(() => URL.revokeObjectURL(fakeUrl), 5000)
      }

      onUploadComplete?.()
      setIsUploading?.(false)
    }
  }, [uploaded, uploadError, success, refundSuccess, refundError, refundedTax, refundTaxId, sendWhatsAppSuccess, sendWhatsAppError, sendWhatsAppOrderId, data._id, data.orderId, dispatch])

  const rows = [
    data.vehicleNumber && (
      <FieldRow label="Vehicle No." value={removeSpaces(data.vehicleNumber)} copyable />
    ),
    data.amount && <FieldRow label="Amount" value={`₹${data.amount}`} />,
    data.paymentMethod && (
      <FieldRow
        label="Payment"
        value={
          data.paymentMethod === 'wallet'
            ? data.gatewayAmountPaid > 0
              ? `Wallet ₹${data.walletAmountPaid || 0} + Gateway ₹${data.gatewayAmountPaid}`
              : `Wallet ₹${data.walletAmountPaid || data.amount}`
            : 'Gateway'
        }
      />
    ),

    data.mobileNumber && canViewContactNumber && (
      <FieldRow label="Mobile" value={data.mobileNumber} copyable isPhone />
    ),
    data.seatCapacity && <FieldRow label="Seating Capacity" value={data.seatCapacity} />,
    data.taxMode && (
      <FieldRow label="Tax Mode" value={removeUnderScoreAndCapitalize(data.taxMode)} />
    ),
    data.startDate && <FieldRow label="Tax From" value={getDateFromDateString(data.startDate)} />,
    data.endDate && <FieldRow label="Tax Upto" value={getDateFromDateString(data.endDate)} />,
    data.vehicleType && <FieldRow label="Vehicle Type" value={data.vehicleType} />,

    data.weight && <FieldRow label="Weight" value={data.weight} />,

    data.chasisNumber && <FieldRow label="Chassis Number" value={data.chasisNumber} />,
    data.whoCompleted && <FieldRow label="Who Completed" value={data.whoCompleted?.username} />,
  ]

  return (
    <CContainer fluid className="px-2 px-md-4 py-2">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <CCard className="border-0 shadow-sm rounded-4" style={{ backgroundColor: '#f1f9f6' }}>
          <CCardBody>
            {/* Header */}
            <CRow className="mb-3">
              <CCol>
                <div className="d-flex justify-content-between">
                  <h6 className="fw-bold text-uppercase mb-1">
                    {`${removeUnderScoreAndCapitalize(data.state)} - ${removeUnderScoreAndCapitalize(data.border)}`}
                  </h6>
                  <div className="d-flex flex-column align-items-end">
                    <h6 className="fw-bold text-uppercase mb-1">
                      {removeUnderScoreAndCapitalize(data.category)}
                    </h6>
                    {showStatus && data.status && (
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            data.status === CONSTANTS.ORDER_STATUS.CONFIRMED
                              ? '#28a745'
                              : data.status === CONSTANTS.ORDER_STATUS.CLOSED
                              ? '#007bff'
                              : data.status === CONSTANTS.ORDER_STATUS.CANCELLED
                              ? '#dc3545'
                              : '#6c757d',
                          color: 'white',
                          fontSize: '0.75rem',
                        }}
                      >
                        {data.status === CONSTANTS.ORDER_STATUS.CONFIRMED
                          ? 'New'
                          : data.status === CONSTANTS.ORDER_STATUS.CLOSED
                          ? 'Completed'
                          : data.status === CONSTANTS.ORDER_STATUS.CANCELLED
                          ? 'Refunded'
                          : removeUnderScoreAndCapitalize(data.status)}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-muted small mb-0">{getDateTimeFromDateString(data.createdAt)}</p>
              </CCol>
            </CRow>

            {/* Dynamic Field Rows */}
            <CRow className="mb-3 g-3">
              {rows.filter(Boolean).map((fieldRow, idx) => (
                <CCol xs={12} sm={6} key={idx}>
                  {fieldRow}
                </CCol>
              ))}
            </CRow>

            {/* File Upload/Download */}
            <CRow className="mb-3 mt-1">
            <CCol className="d-flex align-items-center justify-content-center justify-content-md-between gap-3 flex-wrap">
                {
                  data.status === CONSTANTS.ORDER_STATUS.CONFIRMED && <>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      style={{ minWidth: 90 }}
                      onClick={() => setShowCancelModal(true)}
                      disabled={updateTaxLoading}
                    >
                      {updateTaxLoading ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                    <Modal
                      visible={showCancelModal}
                      onVisibleToggle={() => setShowCancelModal(false)}
                      onClose={() => setShowCancelModal(false)}
                      title="Cancel Order"
                      body={
                        <div>
                          Are you sure you want to cancel this order? The amount will not be refunded automatically.
                        </div>
                      }
                      closeBtnText="No"
                      submitBtnText="Yes, Cancel"
                      submitBtnColor="danger"
                      onSubmitBtnClick={handleCancelConfirm}
                    />
                  </>
                }
                {
                  data.status === CONSTANTS.ORDER_STATUS.CANCELLED && (
                    <>
                      {data.refundedToWallet ? (
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-success fw-semibold">
                            Credited to Wallet
                          </span>
                        </div>
                      ) : data.isAmountRefunded ? (
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-success fw-semibold">
                            Refunded via Gateway
                          </span>
                        </div>
                      ) : (
                        <>
                          {canRefundToWallet && (
                            <>
                              <button
                                className="btn btn-outline-success btn-sm"
                                style={{ minWidth: 150 }}
                                onClick={() => setShowRefundModal(true)}
                                disabled={refundLoading && refundTaxId === data._id}
                              >
                                {refundLoading && refundTaxId === data._id
                                  ? 'Refunding...'
                                  : 'Refund to Wallet'}
                              </button>
                              <Modal
                                visible={showRefundModal}
                                onVisibleToggle={() => {
                                  setShowRefundModal(false)
                                  setRefundPassword('')
                                }}
                                onClose={() => {
                                  setShowRefundModal(false)
                                  setRefundPassword('')
                                }}
                                title="Refund to Wallet"
                                body={
                                  <div>
                                    <p className="mb-2">
                                      Enter the refund password to credit ₹{data.amount} to the user&apos;s wallet.
                                    </p>
                                    <input
                                      type="password"
                                      className="form-control"
                                      placeholder="Refund password"
                                      value={refundPassword}
                                      onChange={(e) => setRefundPassword(e.target.value)}
                                    />
                                  </div>
                                }
                                closeBtnText="Cancel"
                                submitBtnText="Refund"
                                submitBtnColor="success"
                                onSubmitBtnClick={handleRefundToWalletConfirm}
                              />
                            </>
                          )}
                          {/* <button
                            className="btn btn-outline-secondary btn-sm"
                            style={{ minWidth: 150 }}
                            onClick={() => setShowMarkRefundedModal(true)}
                            disabled={updateTaxLoading}
                          >
                            {updateTaxLoading ? 'Updating...' : 'Amount Refunded'}
                          </button> */}
                          <Modal
                            visible={showMarkRefundedModal}
                            onVisibleToggle={() => setShowMarkRefundedModal(false)}
                            onClose={() => setShowMarkRefundedModal(false)}
                            title="Mark Amount as Refunded"
                            body={<div>Have you processed the refund from your side? This will mark the amount as refunded.</div>}
                            closeBtnText="Cancel"
                            submitBtnText="Yes, Mark as Refunded"
                            submitBtnColor="success"
                            onSubmitBtnClick={handleMarkAmountRefunded}
                          />
                        </>
                      )}
                    </>
                  )
                }
                {localFileUrl ? (
                  <>
                    <a
                      target="_blank"
                      href={localFileUrl}
                      download
                      className="text-decoration-none text-primary fw-semibold text-dark"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CIcon icon={cilCloudDownload} className="me-2" />
                      <span className="text-primary"> Download File</span>
                    </a>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <div
                        className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                        style={{ backgroundColor: '#eef8f1' }}
                      >
                        <CIcon
                          icon={cibWhatsapp}
                          size="lg"
                          className={whatsappSent ? 'text-success' : 'text-secondary'}
                        />
                        <div className="d-flex flex-column">
                          <span className="text-muted small">WhatsApp</span>
                          <span
                            className={`small fw-semibold ${whatsappSent ? 'text-success' : 'text-secondary'}`}
                          >
                            {whatsappSent ? 'Sent' : 'Not sent'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        disabled={sendWhatsAppLoading && sendWhatsAppOrderId === data.orderId}
                        onClick={() => dispatch(resendTaxWhatsApp(data.orderId))}
                      >
                        {sendWhatsAppLoading && sendWhatsAppOrderId === data.orderId
                          ? 'Sending...'
                          : 'Resend'}
                      </button>
                    </div>
                  </>
                ) : data.status === CONSTANTS.ORDER_STATUS.CONFIRMED ? (
                  <>
                    <span
                      className="text-primary fw-semibold"
                      style={{ cursor: 'pointer' }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CIcon icon={cilCloudUpload} className="me-2" />
                      {uploadLoading || data.taxLoading ? 'Uploading...' : 'Upload File'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </>
                ) : null}
              </CCol>
            </CRow>

            {/* Errors */}
            {uploadError && (
              <CRow>
                <CCol className="text-danger text-end small">{uploadError}</CCol>
              </CRow>
            )}
            {data.taxError && (
              <CRow>
                <CCol className="text-danger text-end small">Fetch Error: {data.taxError}</CCol>
              </CRow>
            )}
          </CCardBody>
        </CCard>
      </div>
    </CContainer>
  )
}

export default TaxCard
