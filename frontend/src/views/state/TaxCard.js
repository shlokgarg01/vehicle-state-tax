import React, { useRef } from 'react'
import { CCard, CCardBody, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilCloudUpload, cilCopy } from '@coreui/icons'
import { format } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { uploadTax } from '../../actions/orderActions'

const TaxCard = ({ data }) => {
  const {
    state,
    border,
    createdAt,
    vehicleNumber,
    amount,
    mobileNumber,
    seatCapacity,
    taxMode,
    startDate,
    endDate,
    fileUrl,
    category,
    vehicleType,
    weight,
    chasisNumber,
    orderId,
    paymentId,
    status,
  } = data
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)

  const {
    loading: uploadLoading,
    uploaded,
    error: uploadError,
  } = useSelector((state) => state.uploadTax || {})

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const safeFormat = (date, formatStr) => {
    try {
      return format(new Date(date), formatStr)
    } catch (error) {
      return 'Invalid Date'
    }
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('orderId', orderId) // assuming backend expects this

    dispatch(uploadTax(formData))
  }

  return (
    <CCard className="mb-3 shadow-sm rounded-3 p-4" style={{ backgroundColor: '#f1f9f6' }}>
      <CCardBody>
        <CRow className="mb-2 justify-content-between">
          <CCol>
            <h6 className="fw-bold text-uppercase">{`${state} - ${border}`}</h6>
          </CCol>
          <CCol className="text-end text-muted">
            {safeFormat(createdAt, 'dd MMM yyyy, hh:mm a')}
          </CCol>
        </CRow>

        <CRow className="mb-2">
          <CCol md={6}>
            <strong>Vehicle No.</strong>
            <div className="d-flex align-items-center">
              <span className="me-2 text-muted">{vehicleNumber}</span>
              <CIcon
                icon={cilCopy}
                size="sm"
                onClick={() => copyToClipboard(vehicleNumber)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </CCol>
          <CCol md={6} className="text-end">
            <strong>Amount</strong>
            <div className="text-muted">₹{amount}</div>
          </CCol>
        </CRow>

        <CRow className="mb-2">
          <CCol md={6}>
            <strong>Mobile</strong>
            <div className="d-flex align-items-center">
              <span className="me-2 text-muted">{mobileNumber}</span>
              <CIcon
                icon={cilCopy}
                size="sm"
                onClick={() => copyToClipboard(mobileNumber)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </CCol>

          <CCol md={6} className="text-end">
            <strong>Seating Capacity</strong>
            <div className="text-muted">{seatCapacity}</div>
          </CCol>
        </CRow>

        <CRow className="mb-2">
          <CCol md={4}>
            <strong>Tax Mode</strong>
            <div className="text-muted">{taxMode}</div>
          </CCol>
          <CCol md={4}>
            <strong>Tax From</strong>
            <div className="text-muted">{safeFormat(startDate, 'dd MMM yyyy')}</div>
          </CCol>
          <CCol md={4} className="text-end">
            <strong>Tax Upto</strong>
            <div className="text-muted">{safeFormat(endDate, 'dd MMM yyyy')}</div>
          </CCol>
        </CRow>

        <CRow className="mb-2">
          <CCol md={4}>
            <strong>Category</strong>
            <div className="text-muted">{category}</div>
          </CCol>
          <CCol md={4}>
            <strong>Vehicle Type</strong>
            <div className="text-muted">{vehicleType || 'N/A'}</div>
          </CCol>
          <CCol md={4} className="text-end">
            <strong>Weight</strong>
            <div className="text-muted">{weight || 'N/A'}</div>
          </CCol>
        </CRow>

        <CRow className="mb-2">
          <CCol md={6}>
            <strong>Chasis Number</strong>
            <div className="text-muted">{chasisNumber || 'N/A'}</div>
          </CCol>
          <CCol md={6} className="text-end">
            <strong>Status</strong>
            <div className="text-muted text-capitalize">{status}</div>
          </CCol>
        </CRow>

        <CRow className="mb-2">
          <CCol md={6}>
            <strong>Order ID</strong>
            <div className="d-flex align-items-center">
              <span className="me-2 text-muted">{orderId}</span>
              <CIcon
                icon={cilCopy}
                size="sm"
                onClick={() => copyToClipboard(orderId)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </CCol>
          {/* <CCol md={6} className="text-end">
            <strong>Payment ID</strong>
            <div className="text-muted">{paymentId || 'N/A'}</div>
          </CCol> */}
        </CRow>

        <CRow className="mt-3">
          <CCol className="text-end">
            {fileUrl ? (
              <a href={fileUrl} download className="text-decoration-none fw-semibold">
                <CIcon icon={cilCloudDownload} className="me-2" />
                Download File
              </a>
            ) : (
              <>
                <span
                  className="text-decoration-none fw-semibold text-primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <CIcon icon={cilCloudUpload} className="me-2" />
                  {uploadLoading ? 'Uploading...' : 'Upload File'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </>
            )}
          </CCol>
        </CRow>
        {uploadError && (
          <CRow className="mt-2">
            <CCol className="text-danger text-end">{uploadError}</CCol>
          </CRow>
        )}
      </CCardBody>
    </CCard>
  )
}

export default TaxCard
