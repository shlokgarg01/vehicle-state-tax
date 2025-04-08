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

import { deleteSingleUser, getAndSearchUsers } from '../../actions/taxUserAction'

export default function EmployeeList() {
  const dispatch = useDispatch()

  const allTaxUsersState = useSelector((state) => state.allTaxUsers)
  console.log('Redux State:', allTaxUsersState)
  const { loading, taxusers } = allTaxUsersState
  console.log('tax users', taxusers)

  const { isDeleted } = useSelector((state) => state.deleteUser)

  const [contactNumber, setContactNumber] = useState(0)
  const [search, setSearch] = useState('')
  const [user, setUser] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [stateToDelete, setStateToDelete] = useState(null)
  const [errors, setErrors] = useState({})

  const PER_PAGE = 10

  console.log(stateToDelete)

  const toggleStateStatus = (id) => {
    dispatch(deleteSingleUser(id))
    setIsDeleteModalVisible(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!search) {
      setErrors({ contactNumber: 'Contact number is required' })
      return
    }

    dispatch(getAndSearchUsers({ contactNumber: search }))
  }
  console.log(taxusers)
  useEffect(() => {
    if (isDeleted) {
      showToast('User Deleted')
      dispatch(getAndSearchUsers({ page: currentPage }))
      setIsDeleteModalVisible(false)
    }
  }, [isDeleted, dispatch, currentPage])

  console.log(taxusers?.users?.lengt)
  useEffect(() => {
    dispatch(getAndSearchUsers({ page: currentPage, contactNumber: search }))
  }, [dispatch, currentPage])

  return loading ? (
    <Loader />
  ) : (
    <>
      <CCard className="mb-4">
        <CCardHeader className="fw-bold">Search users</CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol sm={4}>
                <TextInput
                  type="text"
                  placeholder="Contact Number"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  id="contactNumber"
                  label="Contact number"
                  errors={errors}
                />
              </CCol>
            </CRow>

            <Button
              title="Search"
              onClick={(e) => handleSearch(e)}
              type="submit"
              color="success"
              btnSmall
              marginBottom
              marginTop
            />
          </CForm>
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader>
          <strong>Users ({taxusers.totalUsersCount})</strong>
        </CCardHeader>
        {taxusers?.users?.length === 0 ? (
          <NoData title="No User Found" />
        ) : (
          <CCardBody>
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Name</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {taxusers?.users?.map((stateData, index) => (
                  <CTableRow key={index + 1}>
                    {/* serial number */}
                    <CTableHeaderCell scope="row">
                      {(currentPage - 1) * PER_PAGE + index + 1}
                    </CTableHeaderCell>
                    {/* contact number */}
                    <CTableDataCell>{stateData.contactNumber}</CTableDataCell>
                    <CTableDataCell>
                      <CCol sm={8}>
                        <Button
                          title="delete"
                          onClick={(e) => {
                            setIsDeleteModalVisible(true)
                            setStateToDelete(stateData._id)
                          }}
                          type="submit"
                          color="primary"
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
              totalPages={Math.ceil(taxusers?.totalUsersCount / taxusers.resultPerPage)}
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
          console.log(stateToDelete)
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
