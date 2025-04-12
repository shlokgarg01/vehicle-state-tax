import React, { useEffect, useRef, useState } from 'react'
import { CCard, CCardBody, CRow, CCol, CContainer } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilCloudUpload, cilCopy } from '@coreui/icons'
import { format } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTaxes, uploadTax } from '../../actions/orderActions'
import { removeUserScoreAndCapitalize } from '../../helpers/strings'
import { showToast } from '../../utils/toast'
import { TAX_CONSTANTS } from '../../constants/taxConstants'

const FieldRow = ({ label, value, copyable }) => (
  <CCol xs={12} md={6} className="mb-2 mb-md-0">
    <strong>{label}</strong>
    <div className="d-flex align-items-center justify-content-md-start justify-content-center text-muted">
      <span className="me-2">{value || 'N/A'}</span>
      {copyable && value && (
        <CIcon
          icon={cilCopy}
          size="sm"
          style={{ cursor: 'pointer' }}
          onClick={() => navigator.clipboard.writeText(value)}
        />
      )}
    </div>
  </CCol>
)

const TaxCard = ({ data, onUploadComplete, setIsUploading }) => {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)

  const [localFileUrl, setLocalFileUrl] = useState(data.fileUrl)

  const {
    loading: uploadLoading,
    uploaded,
    error: uploadError,
  } = useSelector((state) => state.uploadTax || {})

  const formatDate = (dateStr, formatStr = 'dd MMM yyyy') => {
    try {
      return format(new Date(dateStr), formatStr)
    } catch {
      return 'Invalid Date'
    }
  }

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

  useEffect(() => {
    if (uploaded) {
      dispatch({ type: TAX_CONSTANTS.UPLOAD_TAX_RESET })
      dispatch(getAllTaxes())
      showToast('File uploaded successfully', 'success')

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
  }, [uploaded])

  useEffect(() => {
    if (uploadError) setIsUploading?.(false)
  }, [uploadError])

  return (
    <CContainer fluid className="d-flex justify-content-center px-4">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <CCard className="mb-4 shadow-sm rounded-4 border-0" style={{ backgroundColor: '#f1f9f6' }}>
          <CCardBody>
            {/* Header */}
            <CRow className="mb-3">
              <CCol xs={12} md={6}>
                <h6 className="fw-bold text-uppercase mb-1">{`${data.state} - ${data.border}`}</h6>
                <p className="text-muted mb-0">
                  {formatDate(data.createdAt, 'dd MMM yyyy, hh:mm a')}
                </p>
              </CCol>
            </CRow>

            {/* Vehicle Info */}
            <CRow className="mb-3 align-items-center">
              <FieldRow label="Vehicle No." value={data.vehicleNumber} copyable />
              <FieldRow label="Amount" value={`₹${data.amount}`} />
            </CRow>

            <CRow className="mb-3 align-items-center">
              <FieldRow label="Mobile" value={data.mobileNumber} copyable />
              <FieldRow label="Seating Capacity" value={data.seatCapacity} />
            </CRow>

            {/* Tax Details */}
            <CRow className="mb-3">
              <FieldRow label="Tax Mode" value={removeUserScoreAndCapitalize(data.taxMode)} />
              <FieldRow label="Tax From" value={formatDate(data.startDate)} />
              <FieldRow label="Tax Upto" value={formatDate(data.endDate)} />
            </CRow>

            <CRow className="mb-3">
              <FieldRow label="Category" value={removeUserScoreAndCapitalize(data.category)} />
              <FieldRow label="Vehicle Type" value={data.vehicleType} />
              <FieldRow label="Weight" value={data.weight} />
            </CRow>

            <CRow className="mb-3">
              <FieldRow label="Chassis Number" value={data.chasisNumber} />
            </CRow>

            <CRow className="mb-4">
              <FieldRow label="Order ID" value={data.orderId} copyable />
            </CRow>

            {/* File Actions */}
            <CRow className="mb-3">
              <CCol className="text-center text-md-end">
                {localFileUrl ? (
                  <a
                    href={localFileUrl}
                    download
                    className="text-decoration-none fw-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CIcon icon={cilCloudDownload} className="me-2" />
                    Download File
                  </a>
                ) : (
                  <>
                    <span
                      className="text-primary text-decoration-none fw-semibold"
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
                )}
              </CCol>
            </CRow>

            {/* Errors */}
            {uploadError && (
              <CRow className="mt-2">
                <CCol className="text-danger text-end">{uploadError}</CCol>
              </CRow>
            )}
            {data.taxError && (
              <CRow className="mt-2">
                <CCol className="text-danger text-end">Fetch Error: {data.taxError}</CCol>
              </CRow>
            )}
          </CCardBody>
        </CCard>
      </div>
    </CContainer>
  )
}

export default TaxCard
