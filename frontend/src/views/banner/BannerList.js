/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// CoreUI Components
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CRow,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CBadge,
  CSpinner,
} from '@coreui/react'

// Custom Components
import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import SelectInput from '../../components/Form/SelectInput'
import Modal from '../../components/Modal/Modal'
import Pagination from '../../components/Pagination/Pagination'
import NoData from '../../components/NoData'
import Loader from '../../components/Loader/Loader'

// Utilities & Constants
import { showToast } from '../../utils/toast'
import BANNER_CONSTANTS from '../../constants/bannerConstants'

// Actions
import { getBanners, deleteBanner, createBanner } from '../../actions/bannerAction'

export default function BannerManager() {
  const dispatch = useDispatch()

  // State for banner form
  const [banner, setBanner] = useState({ image: null })

  // Search and pagination states
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)

  // Modal and deletion state
  const [bannerToDelete, setBannerToDelete] = useState(null)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)

  // Redux selectors
  const {
    loading: createLoading,
    error: createError,
    success: createSuccess,
  } = useSelector((state) => state.createBanner)
  const {
    data: banners,
    totalBanners,
    totalPages,
    loading: getLoading,
    error: getError,
  } = useSelector((state) => state.bannerList)
  const {
    success: isDeleted,
    loading: deleteLoading,
    error: deleteError,
  } = useSelector((state) => state.deleteBanner)

  // Fetch banners from server
  const fetchBanners = useCallback(
    (params = {}) => {
      const finalParams = { page, perPage, ...params }
      dispatch(getBanners(finalParams))
    },
    [dispatch, perPage, page],
  )

  // Load on mount
  useEffect(() => {
    dispatch(getBanners({ page, perPage }))
  }, [])

  // Refetch on page change
  useEffect(() => {
    dispatch(getBanners({ page, perPage }))
  }, [page])

  // Handle create banner
  const handleCreate = (e) => {
    e.preventDefault()

    if (!banner.image) {
      showToast('Please upload a banner image.', 'error')
      return
    }

    const formData = new FormData()
    formData.append('banner', banner.image)
    dispatch(createBanner(formData))
  }

  // Handle delete banner
  const handleDelete = useCallback(() => {
    if (bannerToDelete) {
      dispatch(deleteBanner(bannerToDelete._id)).then(() => fetchBanners())
    }
    setBannerToDelete(null)
    setIsDeleteModalVisible(false)
  }, [bannerToDelete, dispatch, fetchBanners])

  // Display pagination count
  const displayedCount = useMemo(() => {
    const start = (page - 1) * perPage + 1
    const end = Math.min(page * perPage, totalBanners)
    return `${start}–${end} of ${totalBanners}`
  }, [page, perPage, totalBanners])

  // Success handling
  useEffect(() => {
    if (createSuccess) {
      setBanner({ title: '', status: 'active', image: null })
      fetchBanners()
      dispatch({ type: BANNER_CONSTANTS.CREATE_BANNER_RESET })
    }
  }, [createSuccess, dispatch, fetchBanners])

  useEffect(() => {
    if (isDeleted) {
      fetchBanners()
      dispatch({ type: BANNER_CONSTANTS.DELETE_BANNER_RESET })
      showToast('Banner deleted successfully', 'success')
    }
  }, [isDeleted, dispatch, fetchBanners])

  // Error handling
  useEffect(() => {
    if (createError) showToast(createError, 'error')
    if (deleteError) showToast(deleteError, 'error')
    if (getError) showToast(getError, 'error')
  }, [createError, deleteError, getError])

  // Show loading spinner
  if (createLoading) return <Loader />

  return (
    <>
      {/* Create Banner */}
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="fw-bold">Create Banner</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleCreate}>
            <CRow className="justify-content-center">
              <CCol md={8}>
                {/* Image */}
                <label className="form-label fw-semibold">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-3"
                  onChange={(e) => setBanner({ ...banner, image: e.target.files[0] })}
                />
                {/* Preview */}
                {banner.image && (
                  <CCard className="p-3 text-center shadow-sm">
                    <img
                      src={URL.createObjectURL(banner.image)}
                      alt="Preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: '250px', objectFit: 'contain', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.preventDefault() // 🔒 Prevent any default form or navigation
                        const blobUrl = URL.createObjectURL(banner.image)
                        window.open(blobUrl, '_blank', 'noopener,noreferrer')
                      }}
                    />
                    <p className="mt-2 text-muted">Click to enlarge</p>
                  </CCard>
                )}
                {/* Action Buttons */}
                <div className="d-flex justify-content-center gap-2 mt-3 pb-4">
                  <Button
                    title="Reset"
                    type="button"
                    color="danger"
                    onClick={() => setBanner({ title: '', status: 'active', image: null })}
                  />
                  <Button
                    title={createLoading ? <CSpinner size="sm" /> : 'Create Banner'}
                    type="submit"
                    color="success"
                    disabled={createLoading}
                  />
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Banner Table */}
      <CCard>
        <CCardHeader>
          <strong>
            Banners <span className="text-muted small">({displayedCount})</span>
          </strong>
        </CCardHeader>
        <CCardBody>
          {getLoading ? (
            <Loader />
          ) : banners.length === 0 ? (
            <NoData title="No Banner Found" />
          ) : (
            <>
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Image</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {banners.map((banner, index) => (
                    <CTableRow key={banner._id}>
                      <CTableDataCell>{(page - 1) * perPage + index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <img src={banner.url} alt={banner.title} style={{ width: '100px' }} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <Button
                          title="Delete"
                          onClick={() => {
                            setBannerToDelete(banner)
                            setIsDeleteModalVisible(true)
                          }}
                          color="danger"
                          btnSmall
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </CCardBody>
      </CCard>

      {/* Confirm Delete Modal */}
      <Modal
        visible={isDeleteModalVisible}
        onVisibleToggle={() => setIsDeleteModalVisible(false)}
        onSubmitBtnClick={handleDelete}
        onClose={() => setIsDeleteModalVisible(false)}
        title="Delete Banner"
        body={`Are you sure you want to delete the banner. This action cannot be undone.`}
        closeBtnText="Cancel"
        submitBtnText="Delete"
        submitBtnColor="danger"
      />
    </>
  )
}
