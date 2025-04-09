import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBanners, deleteBanner } from '../../actions/bannerAction'
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
} from '@coreui/react'
import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import Modal from '../../components/Modal/Modal'
import Pagination from '../../components/Pagination/Pagination'
import NoData from '../../components/NoData'
import Loader from '../../components/Loader/Loader'

export default function BannerList() {
  const dispatch = useDispatch()

  const {
    data: banners = [],
    totalBanners,
    currentPage: storePage,
    totalPages,
    loading,
  } = useSelector((state) => state.bannerList)

  const [search, setSearch] = useState({ title: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState(null)

  const handleReset = useCallback(() => {
    const resetSearch = { title: '' }
    setSearch(resetSearch)
    setCurrentPage(1)
    dispatch(getBanners({ ...resetSearch, page: 1, limit }))
  }, [dispatch, limit])

  const handleDelete = () => {
    if (bannerToDelete) {
      dispatch(deleteBanner(bannerToDelete)).then(() => {
        fetchBanners() // Refresh after deletion
      })
    }
    setBannerToDelete(null)
    setIsDeleteModalVisible(false)
  }

  const fetchBanners = useCallback(() => {
    dispatch(getBanners())
  }, [dispatch])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBanners()
    }, 400)
    return () => clearTimeout(timer)
  }, [fetchBanners])

  return loading ? (
    <Loader />
  ) : (
    <>
      {/* Search Section */}
      <CCard className="mb-4">
        <CCardHeader className="fw-bold">Search Banners</CCardHeader>
        <CCardBody>
          <CForm>
            <CRow className="align-items-end">
              <CCol sm={4}>
                <TextInput
                  type="text"
                  placeholder="Search by Title"
                  value={search.title}
                  onChange={(e) => setSearch((prev) => ({ ...prev, title: e.target.value }))}
                  id="title"
                />
              </CCol>
              <CCol sm={2}>
                <Button
                  title="Reset"
                  type="button"
                  color="danger"
                  fullWidth
                  onClick={handleReset}
                />
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Table Section */}
      <CCard>
        <CCardHeader>
          <strong>Banners ({totalBanners || 0})</strong>
        </CCardHeader>
        <CCardBody>
          {banners.length === 0 ? (
            <NoData title="No Banner Found" />
          ) : (
            <>
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Title</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Image</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {banners.map((banner, index) => (
                    <CTableRow key={banner._id}>
                      <CTableHeaderCell>{(currentPage - 1) * limit + index + 1}</CTableHeaderCell>
                      <CTableDataCell>{banner.title}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={banner.status === 'active' ? 'success' : 'secondary'}>
                          {banner.status}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <img src={banner.image} alt={banner.title} style={{ width: '100px' }} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <Button
                          title="Delete"
                          onClick={() => {
                            setBannerToDelete(banner._id)
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

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CCardBody>
      </CCard>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        onVisibleToggle={() => setIsDeleteModalVisible(false)}
        onSubmitBtnClick={handleDelete}
        onClose={() => setIsDeleteModalVisible(false)}
        title="Delete Banner"
        body="Are you sure you want to delete this banner?"
        closeBtnText="Cancel"
        submitBtnText="Delete"
        submitBtnColor="danger"
      />
    </>
  )
}
