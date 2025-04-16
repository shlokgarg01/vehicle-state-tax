/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { CCard, CCardBody, CRow, CCol, CContainer } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilCloudUpload, cilCopy } from '@coreui/icons'
import { format } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTaxes, uploadTax } from '../../actions/orderActions'
import { removeUnderScoreAndCapitalize } from '../../helpers/strings'
import { showToast } from '../../utils/toast'
import { TAX_CONSTANTS } from '../../constants/taxConstants'
import { getDateFromDateString } from '../../helpers/Date'

const FieldRow = ({ label, value, copyable }) => {
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

  return (
    <div className="d-flex flex-column">
      <strong className="text-dark">{label}</strong>
      <div className="d-flex align-items-center text-muted">
        <span className="me-2 small">{value}</span>
        {copyable && (
          <CIcon
            icon={cilCopy}
            size="sm"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigator.clipboard ? navigator.clipboard.writeText(value) : copyTextFallback(value) // navigator.clipboard is null on apps deployed on HTTP, so in our case we were not able to copy on production, but it works on localhost. Hence using a fallback way.
              showToast('Copied', 'success', 500)
            }}
          />
        )}
      </div>
    </div>
  )
}

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
    if (uploadError) {
      showToast(uploadError, 'error')
      setIsUploading?.(false)
    }

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
  }, [uploaded, uploadError])

  const rows = [
    data.vehicleNumber && <FieldRow label="Vehicle No." value={data.vehicleNumber} copyable />,
    data.amount && <FieldRow label="Amount" value={`₹${data.amount}`} />,

    data.mobileNumber && <FieldRow label="Mobile" value={data.mobileNumber} copyable />,
    data.seatCapacity && <FieldRow label="Seating Capacity" value={data.seatCapacity} />,
    data.startDate && <FieldRow label="Tax From" value={formatDate(data.startDate)} />,
    data.endDate && <FieldRow label="Tax Upto" value={getDateFromDateString(data.endDate)} />,
    data.category && (
      <FieldRow label="Category" value={removeUnderScoreAndCapitalize(data.category)} />
    ),
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
              <CCol xs={12} sm={6}>
                <h6 className="fw-bold text-uppercase mb-1">
                  {`${removeUnderScoreAndCapitalize(data.state)} - ${removeUnderScoreAndCapitalize(data.border)}`}
                </h6>
                <p className="text-muted small mb-0">
                  {formatDate(data.createdAt, 'dd MMM yyyy, hh:mm a')}
                </p>
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
              <CCol className="text-center text-md-end">
                {localFileUrl ? (
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
                ) : (
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
                )}
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
