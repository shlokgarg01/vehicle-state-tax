/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// UI Components
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
  CSpinner,
} from '@coreui/react'

// Custom Components
import Loader from '../../components/Loader/Loader'
import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import Modal from '../../components/Modal/Modal'
import NoData from '../../components/NoData'
import Pagination from '../../components/Pagination/Pagination'
import UserForm from '../../components/Form/UserForm'

// Utils
import { showToast } from '../../utils/toast'
import Constants from '../../utils/constants'
import { EMPLOYEE_CONSTANTS } from '../../constants/employeeConstants'

// Actions
import {
  getAndSearchEmployee,
  updateSingleEmployee,
  deleteSingleEmployee,
  createEmployee,
} from '../../actions/employeeAction'

export default function EmployeeList() {
  const dispatch = useDispatch()

  // Redux: Create employee
  const {
    loading: createLoading,
    error: createError,
    success: createSuccess,
  } = useSelector((state) => state.createEmployee)

  // Redux: Get all employees
  const {
    employees,
    loading: getLoading,
    error: getError,
  } = useSelector((state) => state.getEmployee)

  // Redux: Update employee
  const {
    isUpdated,
    loading: updateLoading,
    error: updateError,
  } = useSelector((state) => state.updateEmployee)

  // Redux: Delete employee
  const {
    isDeleted,
    loading: deleteLoading,
    error: deleteError,
  } = useSelector((state) => state.deleteEmployee)

  const [employee, setEmployee] = useState({
    username: '',
    email: '',
    password: '',
    contactNumber: '',
  })
  const [editUser, setEditUser] = useState({
    username: '',
    email: '',
    contactNumber: '',
    status: '',
  })
  const [editErrors, setEditErrors] = useState({})
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [search, setSearch] = useState({ contactNumber: '', username: '', email: '' })
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [stateToDelete, setStateToDelete] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)

  //  Create Employee
  const handleCreateEmployee = (e) => {
    e.preventDefault()
    setEditErrors({})

    const newErrors = {}
    if (!employee.username.trim()) newErrors.username = 'Username is required'
    if (!employee.password.trim()) newErrors.password = 'Password is required'
    if (employee.email && !/^\S+@\S+\.\S+$/.test(employee.email)) newErrors.email = 'Invalid email'
    if (employee.contactNumber && !/^\d{10}$/.test(employee.contactNumber))
      newErrors.contactNumber = 'Must be 10 digits'

    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors)
      return
    }

    dispatch(createEmployee(employee))
  }

  //  Update Employee
  const handleUpdateUser = () => {
    const newErrors = {}

    if (!editUser.username?.trim()) newErrors.username = 'Required'
    if (editUser.contactNumber && !/^\d{10}$/.test(editUser.contactNumber))
      newErrors.contactNumber = 'Must be 10 digits'
    if (editUser.email && !/^\S+@\S+\.\S+$/.test(editUser.email))
      newErrors.email = 'Invalid email format'
    if (!editUser.status) newErrors.status = 'Status is required'

    if (Object.keys(newErrors).length) {
      setEditErrors(newErrors)
      return
    }

    const updatePayload = {
      username: editUser.username,
      email: editUser.email || null,
      contactNumber: editUser.contactNumber || null,
      status: editUser.status,
    }

    if (editUser.password?.trim()) {
      updatePayload.password = editUser.password
    }

    dispatch(updateSingleEmployee(editUser._id, updatePayload))
    setIsEditModalVisible(false)
  }

  //  Delete Employee
  const toggleStateStatus = (id) => {
    dispatch(deleteSingleEmployee(id))
    setIsDeleteModalVisible(false)
  }

  //  Handle Password Toggle
  const handlePasswordToggle = () => setShowPassword((prev) => !prev)

  //  Handle Search
  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(getAndSearchEmployee({ ...search, page: 1, limit }))
    setCurrentPage(1)
  }

  // Reset Form & Fetch on Create Success
  useEffect(() => {
    if (createSuccess) {
      showToast('Employee created successfully', 'success')
      setEmployee({
        username: '',
        email: '',
        password: '',
        contactNumber: '',
      })
      dispatch(getAndSearchEmployee({ page: 1 }))
    }

    if (createError) {
      showToast(createError, 'error')
    }
  }, [createSuccess, createError, dispatch])

  //  Fetch on Delete/Update Success
  useEffect(() => {
    if (isDeleted) {
      dispatch(getAndSearchEmployee({ page: currentPage }))
      dispatch({ type: EMPLOYEE_CONSTANTS.DELETE_EMPLOYEE_RESET })
      showToast('Employee deleted successfully', 'success')
    }
    if (isUpdated) {
      dispatch(getAndSearchEmployee({ page: currentPage }))
      dispatch({ type: EMPLOYEE_CONSTANTS.UPDATE_EMPLOYEE_RESET })
      showToast('Employee updated successfully', 'success')
    }
  }, [isDeleted, isUpdated, currentPage, dispatch])

  // Auto Pagination Adjustment if No Data
  useEffect(() => {
    if (
      employees?.managers?.length === 0 &&
      currentPage > 1 &&
      currentPage > employees?.totalPages
    ) {
      setCurrentPage((prev) => prev - 1)
    }
  }, [employees, currentPage])

  //  Fetch on Page Change
  useEffect(() => {
    dispatch(getAndSearchEmployee({ ...search, page: currentPage }))
  }, [dispatch, currentPage])
  useEffect(() => {
    if (updateError) {
      showToast(updateError, 'error')
    }
    if (deleteError) {
      showToast(deleteError, 'error')
    }
  }, [getError, updateError, deleteError])

  const loading = createLoading || getLoading || updateLoading || deleteLoading
  const error = updateError
  return loading ? (
    <Loader />
  ) : (
    <>
      {/* create employee */}
      <CCard className="mb-4">
        <CCardHeader className="fw-bold">Create Employee</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleCreateEmployee} >
            <CRow className="justify-content-center">
              <CCol md={8}>
                {createError?.data?.message && (
                  <p className="text-danger text-center fw-semibold">
                    {createError?.data?.message || createError}
                  </p>
                )}

                {/* Username */}
                <CRow className="mb-3 align-items-center">
                  <CCol md={3}>
                    <label htmlFor="username" className="form-label fw-semibold">
                      Username
                    </label>
                  </CCol>
                  <CCol md={9}>
                    <TextInput
                      type="text"
                      id="create-username"
                      placeholder="Enter Username"
                      value={employee.username}
                      onChange={(e) => setEmployee({ ...employee, username: e.target.value })}
                      errors={error}
                    />
                    {editErrors?.username && (
                      <p className="text-danger small mt-1">{editErrors.username}</p>
                    )}
                  </CCol>
                </CRow>

                {/* Email */}
                <CRow className="mb-3 align-items-center">
                  <CCol md={3}>
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                  </CCol>
                  <CCol md={9}>
                    <TextInput
                      type="email"
                      id="create-email"
                      placeholder="Enter Email"
                      value={employee.email}
                      onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                      errors={error}
                    />
                    {editErrors?.email && (
                      <p className="text-danger small mt-1">{editErrors.email}</p>
                    )}
                  </CCol>
                </CRow>

                {/* Password */}
                <CRow className="mb-3 align-items-center">
                  <CCol md={3}>
                    <label htmlFor="password" className="form-label fw-semibold">
                      Password
                    </label>
                  </CCol>
                  <CCol md={9}>
                    <TextInput
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="Enter Password"
                      value={employee.password}
                      onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
                      errors={error}
                      showPasswordToggle={true}
                      togglePasswordVisibility={handlePasswordToggle}
                    />
                    {editErrors?.password && (
                      <p className="text-danger small mt-1">{editErrors.password}</p>
                    )}
                  </CCol>
                </CRow>

                {/* Contact Number */}
                <CRow className="mb-4 align-items-center">
                  <CCol md={3}>
                    <label htmlFor="contactNumber" className="form-label fw-semibold">
                      Contact Number
                    </label>
                  </CCol>
                  <CCol md={9}>
                    <TextInput
                      type="number"
                      id="create-contactNumber"
                      placeholder="Enter Contact Number"
                      value={employee.contactNumber}
                      onChange={(e) =>
                        setEmployee({
                          ...employee,
                          contactNumber: e.target.value,
                        })
                      }
                      errors={error}
                    />
                    {editErrors?.contactNumber && (
                      <p className="text-danger small mt-1">{editErrors.contactNumber}</p>
                    )}
                  </CCol>
                </CRow>

                {/* Buttons */}
                <div className="d-flex justify-content-center gap-2 pb-4">
                  <Button
                    title="Reset"
                    type="button"
                    color="danger"
                    onClick={() =>
                      setEmployee({
                        username: '',
                        email: '',
                        password: '',
                        contactNumber: '',
                      })
                    }
                  />
                  <Button
                    title={createLoading ? <CSpinner size="sm" /> : 'Create employee'}
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

      {/* search and filter functionality */}
      <CForm onSubmit={handleSearch}>
        <CRow className="align-items-end">
          <CCol sm={3}>
            <TextInput
              type="text"
              placeholder="Contact Number"
              value={search.contactNumber}
              onChange={(e) => setSearch({ ...search, contactNumber: e.target.value })}
              id="search-contactNumber"
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

      {/* display employee */}
      <CCard>
        <CCardHeader>
          <strong>
            Employee ({(currentPage - 1) * Constants.ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * Constants.ITEMS_PER_PAGE, employees.totalManagers)} of{' '}
            {employees.totalManagers})
          </strong>
        </CCardHeader>
        {employees?.managers?.length === 0 ? (
          <NoData title="No User Found" />
        ) : (
          <CCardBody>
            <CTable striped hover responsive className="table-sm compact-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Edit</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {employees?.managers?.map((stateData, index) => (
                  <CTableRow key={stateData._id}>
                    <CTableDataCell>{(currentPage - 1) * limit + index + 1}</CTableDataCell>
                    <CTableDataCell>{stateData.email || '-'}</CTableDataCell>
                    <CTableDataCell>{stateData.username}</CTableDataCell>
                    <CTableDataCell>{stateData.contactNumber || '-'}</CTableDataCell>
                    <CTableDataCell>
                      <span
                        className={`badge bg-${stateData?.status === 'active' ? 'success' : 'secondary'}`}
                      >
                        {stateData.status}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      {stateData.role !== Constants.ROLES.ADMIN && (
                        <Button
                          title="Delete"
                          color="danger"
                          size="sm"
                          onClick={() => {
                            setStateToDelete(stateData._id)
                            setIsDeleteModalVisible(true)
                          }}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <Button
                        title="Edit"
                        color="success"
                        size="sm"
                        onClick={() => {
                          setEditUser(stateData)
                          setIsEditModalVisible(true)
                        }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <Pagination
              currentPage={currentPage}
              totalPages={employees?.totalPages}
              itemsPerPage={Constants.ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </CCardBody>
        )}
      </CCard>

      {/* delete modal */}
      <Modal
        visible={isDeleteModalVisible}
        onVisibleToggle={() => setIsDeleteModalVisible(!isDeleteModalVisible)}
        onSubmitBtnClick={() => {
          toggleStateStatus(stateToDelete)
        }}
        onClose={() => setIsDeleteModalVisible(false)}
        title="Delete EMployee"
        body="Are you sure you want to delete this employee?"
        closeBtnText="Close"
        submitBtnText="Yes"
        submitBtnColor="success"
      />

      {/* update modal */}
      <Modal
        visible={isEditModalVisible}
        onVisibleToggle={() => setIsEditModalVisible(!isEditModalVisible)}
        onSubmitBtnClick={handleUpdateUser}
        onClose={() => setIsEditModalVisible(false)}
        title="Edit employee"
        body={<UserForm userData={editUser} setUserData={setEditUser} errors={editErrors} />}
        closeBtnText="Cancel"
        submitBtnText="Update"
        submitBtnColor="success"
      />
    </>
  )
}
