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

// import { deleteSingleUser, getAndSearchUsers } from '../../actions/usersAction'
import {
  getAndSearchEmployee,
  updateSingleEmployee,
  deleteSingleEmployee,
} from '../../actions/employeeAction'
import Constants from '../../utils/constants'
export default function EmployeeList() {
  const dispatch = useDispatch()

  const allTaxUsersState = useSelector((state) => state.allTaxUsers)

  const { employees, loading, error } = useSelector((state) => state.getEmployee)
  const { isDeleted } = useSelector((state) => state.deleteEmployee)
  const { isUpdated } = useSelector((state) => state.updateEmployee)
  console.log(employees)

  const [search, setSearch] = useState({ contactNumber: '', username: '', email: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [stateToDelete, setStateToDelete] = useState(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [editUser, setEditUser] = useState({ username: '', email: '', contactNumber: '' })
  const [editErrors, setEditErrors] = useState({})
  const handleUpdateUser = () => {
    // Basic validation (optional)
    if (!editUser.username || !editUser.email) {
      setEditErrors({ username: 'Required', email: 'Required' })
      return
    }
    console.log(editUser)
    dispatch(
      updateSingleEmployee(editUser._id, {
        username: editUser.username,
        email: editUser.email,
        contactNumber: editUser.contactNumber,
      }),
    )
    setIsEditModalVisible(false)
  }

  const toggleStateStatus = (id) => {
    console.log(id)
    dispatch(deleteSingleEmployee(id))
    setIsDeleteModalVisible(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()

    dispatch(getAndSearchEmployee(search, page, limit))

    setCurrentPage(1)
  }
  console.log(search)

  useEffect(() => {
    dispatch(getAndSearchEmployee({ ...search, page: currentPage }))
  }, [dispatch, currentPage])

  return loading ? (
    <Loader />
  ) : (
    <>
      {/* <CCard className="mb-4">
        <CCardHeader className="fw-bold">Search Employees</CCardHeader>
        <CCardBody> */}
      <CForm onSubmit={handleSearch}>
        <CRow className="align-items-end">
          <CCol sm={3}>
            <TextInput
              type="text"
              placeholder="Contact Number"
              value={search.contactNumber}
              onChange={(e) => setSearch({ ...search, contactNumber: e.target.value })}
              id="contactNumber"
              // label="Contact Number"
              errors={error}
            />
          </CCol>
          <CCol sm={2}>
            <TextInput
              type="text"
              placeholder="Username"
              value={search.username}
              onChange={(e) => setSearch({ ...search, username: e.target.value })}
              id="username"
              // label="Username"
              errors={error}
            />
          </CCol>
          <CCol sm={3}>
            <TextInput
              type="email"
              placeholder="Email"
              value={search.email}
              onChange={(e) => setSearch({ ...search, email: e.target.value })}
              id="email"
              // label="Email"
              errors={error}
            />
          </CCol>
          <CCol sm={2}>
            <Button title="Search" type="submit" color="success" btnSmall fullWidth marginBottom />
          </CCol>
          <CCol sm={2}>
            <Button
              title="Reset"
              type="button"
              color="danger"
              btnSmall
              fullWidth
              marginBottom
              onClick={() => {
                setSearch({ contactNumber: '', username: '', email: '' })
                dispatch(getAndSearchEmployee({ page: 1 }))
                setCurrentPage(1)
              }}
            />
          </CCol>
        </CRow>
      </CForm>
      {/* </CCardBody>
      </CCard> */}

      <CCard>
        <CCardHeader>
          <strong>Employee ({employees.totalManagers})</strong>
        </CCardHeader>
        {employees?.managers?.length === 0 ? (
          <NoData title="No User Found" />
        ) : (
          <CCardBody>
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {employees?.managers?.map((stateData, index) => (
                  <CTableRow key={index + 1}>
                    {/* serial number */}
                    <CTableHeaderCell scope="row">
                      {(currentPage - 1) * Constants.ITEMS_PER_PAGE + index + 1}
                    </CTableHeaderCell>
                    {/* email */}
                    <CTableDataCell>{stateData.email}</CTableDataCell>
                    {/* username */}
                    <CTableDataCell>{stateData.username}</CTableDataCell>
                    {/* contact number */}
                    <CTableDataCell>{stateData.contactNumber}</CTableDataCell>
                    <CTableDataCell>{stateData.status}</CTableDataCell>
                    <CTableDataCell>
                      <CCol sm={8}>
                        <Button
                          title="delete"
                          onClick={(e) => {
                            setIsDeleteModalVisible(true)
                            setStateToDelete(stateData._id)
                          }}
                          type="submit"
                          color="danger"
                          btnSmall
                          marginBottom
                          marginTop
                        ></Button>
                      </CCol>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CCol sm={8}>
                        <Button
                          title="edit"
                          onClick={(e) => {
                            setEditUser(stateData) // Prefill form with user data
                            setEditErrors({})
                            setIsEditModalVisible(true)
                          }}
                          type="submit"
                          color="success"
                          btnSmall
                          marginBottom
                          marginTop
                        ></Button>
                      </CCol>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(employees?.totalManagers / employees.resultsPerPage)}
              onPageChange={setCurrentPage}
            />
          </CCardBody>
        )}
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
      <Modal
        visible={isEditModalVisible}
        onVisibleToggle={() => setIsEditModalVisible(!isEditModalVisible)}
        onSubmitBtnClick={handleUpdateUser}
        onClose={() => setIsEditModalVisible(false)}
        title="Update User"
        body={
          <div className="d-flex flex-column gap-2">
            <TextInput
              label="Username"
              value={editUser.username}
              onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
              placeholder="Enter username"
              id="username"
              errors={editErrors}
            />
            <TextInput
              label="Email"
              type="email"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              placeholder="Enter email"
              id="email"
              errors={editErrors}
            />
            <TextInput
              label="Contact Number"
              value={editUser.contactNumber}
              onChange={(e) => setEditUser({ ...editUser, contactNumber: e.target.value })}
              placeholder="Enter contact number"
              id="contactNumber"
              errors={editErrors}
            />
          </div>
        }
        closeBtnText="Cancel"
        submitBtnText="Update"
        submitBtnColor="success"
      />
    </>
  )
}
