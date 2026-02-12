/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { CCard, CCardBody, CRow, CCol, CContainer } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibWhatsapp, cilCloudDownload, cilCloudUpload, cilCopy, cilPhone } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { resendTaxWhatsApp, updateTax, uploadTax } from '../../actions/orderActions'
import { removeSpaces, removeUnderScoreAndCapitalize } from '../../helpers/strings'
import { showToast } from '../../utils/toast'
import { TAX_CONSTANTS } from '../../constants/taxConstants'
import { getDateFromDateString, getDateTimeFromDateString } from '../../helpers/Date'
import CONSTANTS from '../../utils/constants'
import Modal from '../../components/Modal/Modal'

const FieldRow = ({ label, value, copyable, isPhone }) => {
  if (!value) return null

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
    navigator.clipboard ? navigator.clipboard.writeText(value) : copyTextFallback(value) // navigator.clipboard is null on apps deployed on HTTP, so in our case we were not able to copy on production, but it works on localhost. Hence using a fallback way.
    showToast('Copied', 'success', 500)
  }

  const handleCall = () => {
    window.open(`tel:${value}`, '_self')
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${value}`, '_blank')
  }

  return (
    <div className="d-flex flex-column">
      <strong className="text-dark">{label}</strong>
      <div className="d-flex align-items-center text-muted">
        <span className="me-2 small">{value}</span>
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

const TaxCard = ({ data, onUploadComplete, setIsUploading, showStatus }) => {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const [localFileUrl, setLocalFileUrl] = useState(data.fileUrl)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [showMarkRefundedModal, setShowMarkRefundedModal] = useState(false)
  const whatsappSent = data?.isWhatsAppNotificationSent

  const {
    loading: uploadLoading,
    uploaded,
    error: uploadError,
  } = useSelector((state) => state.uploadTax || {})
  const { loading: updateTaxLoading, success, tax: updatedTax } = useSelector((state) => state.updateTax)
  const {
    loading: sendWhatsAppLoading,
    success: sendWhatsAppSuccess,
    error: sendWhatsAppError,
    message: sendWhatsAppMessage,
    currentOrderId: sendWhatsAppOrderId,
  } = useSelector((state) => state.sendWhatsApp || {})

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

  const handleRefundConfirm = () => {
    dispatch(updateTax(data._id, { status: CONSTANTS.ORDER_STATUS.CANCELLED }))
    setShowRefundModal(false)
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
  }, [uploaded, uploadError, success, sendWhatsAppSuccess, sendWhatsAppError, sendWhatsAppOrderId, data._id, data.orderId, dispatch])

  const rows = [
    data.vehicleNumber && (
      <FieldRow label="Vehicle No." value={removeSpaces(data.vehicleNumber)} copyable />
    ),
    data.amount && <FieldRow label="Amount" value={`₹${data.amount}`} />,

    data.mobileNumber && <FieldRow label="Mobile" value={data.mobileNumber} copyable isPhone />,
    data.seatCapacity && <FieldRow label="Seating Capacity" value={data.seatCapacity} />,
    data.startDate && <FieldRow label="Tax From" value={getDateFromDateString(data.startDate)} />,
    data.endDate && <FieldRow label="Tax Upto" value={getDateFromDateString(data.endDate)} />,
    data.vehicleType && <FieldRow label="Vehicle Type" value={data.vehicleType} />,

    data.weight && <FieldRow label="Weight" value={data.weight} />,
    data.taxMode && (
      <FieldRow label="Tax Mode" value={removeUnderScoreAndCapitalize(data.taxMode)} />
    ),

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
                      onClick={() => setShowRefundModal(true)}
                      disabled={updateTaxLoading}
                    >
                      {updateTaxLoading ? 'Refunding...' : 'Refund'}
                    </button>
                    <Modal
                      visible={showRefundModal}
                      onVisibleToggle={() => setShowRefundModal(false)}
                      onClose={() => setShowRefundModal(false)}
                      title="Refund Tax"
                      body={<div>Are you sure you want to refund this tax?</div>}
                      closeBtnText="No"
                      submitBtnText="Yes, Refund"
                      submitBtnColor="danger"
                      onSubmitBtnClick={handleRefundConfirm}
                    />
                  </>
                }
                {
                  data.status === CONSTANTS.ORDER_STATUS.CANCELLED && (
                    <>
                      {data.isAmountRefunded ? (
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-success fw-semibold">
                            Amount Refunded
                          </span>
                        </div>
                      ) : (
                        <>
                          <button
                            className="btn btn-outline-success btn-sm"
                            style={{ minWidth: 150 }}
                            onClick={() => setShowMarkRefundedModal(true)}
                            disabled={updateTaxLoading}
                          >
                            {updateTaxLoading ? 'Updating...' : 'Amount Refunded'}
                          </button>
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
