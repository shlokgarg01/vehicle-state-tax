/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader/Loader'
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
} from '@coreui/react'

import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import Modal from '../../components/Modal/Modal'
import { showToast } from '../../utils/toast'
import NoData from '../../components/NoData'
import Pagination from '../../components/Pagination/Pagination'
import { deleteSingleUser, getAndSearchUsers } from '../../actions/usersAction'
import Constants from '../../utils/constants'

export default function UserSearch() {
  const dispatch = useDispatch()

  const { loading, users, errors } = useSelector((state) => state.users)
  const { isDeleted } = useSelector((state) => state.deleteUser)

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [stateToDelete, setStateToDelete] = useState(null)

  const toggleStateStatus = (id) => {
    dispatch(deleteSingleUser(id))
    setIsDeleteModalVisible(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)

    if (!search.trim()) {
      dispatch(getAndSearchUsers({ page: 1 }))
    } else {
      dispatch(getAndSearchUsers({ search, page: 1 }))
    }
  }

  useEffect(() => {
    if (isDeleted) {
      showToast('User Deleted')
      dispatch(deleteSingleUser({ page: currentPage }))
      setIsDeleteModalVisible(false)
    }
  }, [isDeleted, dispatch, currentPage])

  useEffect(() => {
    dispatch(getAndSearchUsers({ page: currentPage, search }))
  }, [dispatch, currentPage])

  return loading ? (
    <Loader />
  ) : (
    <>
      <CCard className="mb-4">
        <CCardHeader className="fw-bold">Search Users</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSearch}>
            <CRow>
              <CCol sm={8}>
                <TextInput
                  type="text"
                  placeholder="Contact Number"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  id="contactNumber"
                  errors={errors}
                />
              </CCol>

              <CCol sm={2}>
                <Button
                  title="Search"
                  type="submit"
                  color="success"
                  btnLarge
                  fullWidth
                  marginBottom
                />
              </CCol>
              <CCol sm={2}>
                <Button
                  title="Reset"
                  onClick={() => {
                    setSearch('')

                    dispatch(getAndSearchUsers({ page: 1 }))
                  }}
                  type="button"
                  color="danger"
                  btnLarge
                  fullWidth
                  marginBottom
                />
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader>
          <strong>
            {' '}
            Users ({(currentPage - 1) * Constants.ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * Constants.ITEMS_PER_PAGE, users.totalUsersCount)} of{' '}
            {users.filteredUsersCount})
          </strong>
        </CCardHeader>
        {users?.users?.length === 0 ? (
          <NoData title="No User Found" />
        ) : (
          <CCardBody>
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Name</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users?.users?.map((stateData, index) => (
                  <CTableRow key={index + 1}>
                    {/* serial number */}
                    <CTableHeaderCell scope="row">
                      {(currentPage - 1) * Constants.ITEMS_PER_PAGE + index + 1}
                    </CTableHeaderCell>
                    {/* contact number */}
                    <CTableDataCell>{stateData.contactNumber}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(users?.totalUsersCount / users.resultsPerPage)}
              onPageChange={setCurrentPage}
            />
          </CCardBody>
        )}
        <p className="text-end text-muted small mt-2">
          Showing {(currentPage - 1) * Constants.ITEMS_PER_PAGE + 1} to{' '}
          {Math.min(currentPage * Constants.ITEMS_PER_PAGE, users.filteredUsersCount)} of{' '}
          {users.totalUsersCount} entries
        </p>
      </CCard>

      <Modal
        visible={isDeleteModalVisible}
        onVisibleToggle={() => setIsDeleteModalVisible(!isDeleteModalVisible)}
        onSubmitBtnClick={() => {
          toggleStateStatus(stateToDelete)
        }}
        onClose={() => setIsDeleteModalVisible(false)}
        title="Delete User"
        body="Are you sure you want to delete the user ?"
        closeBtnText="Close"
        submitBtnText="Yes"
        submitBtnColor="success"
      />
    </>
  )
}
