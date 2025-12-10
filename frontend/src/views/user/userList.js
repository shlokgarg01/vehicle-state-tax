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
import { showToast } from '../../utils/toast'
import NoData from '../../components/NoData'
import Pagination from '../../components/Pagination/Pagination'
import { deleteSingleUser, exportAllUsers, getAndSearchUsers } from '../../actions/usersAction'
import Constants from '../../utils/constants'
import { getDateFromDateString } from '../../helpers/Date'
import { getWhatsAppMessage } from '../../actions/constantsAction'
import CIcon from '@coreui/icons-react'
import { cibWhatsapp } from '@coreui/icons'
import { USERS_CONSTANTS } from '../../constants/usersConstants'

export default function UserSearch() {
  const dispatch = useDispatch()

  const { loading, users, errors } = useSelector((state) => state.users)
  const { isDeleted } = useSelector((state) => state.deleteUser)
  const { message: whatsAppMessage } = useSelector((state) => state.whatsAppMessage)
  const {
    loading: exportLoading,
    success: exportSuccess,
    error: exportError,
    message: exportMessage,
  } = useSelector((state) => state.exportUsers || {})

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)

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

  useEffect(() => {
    dispatch(getWhatsAppMessage())
  }, [dispatch])

  useEffect(() => {
    if (exportSuccess) {
      showToast(exportMessage || 'Export started. Check your email shortly.')
      dispatch({ type: USERS_CONSTANTS.EXPORT_USERS_RESET })
    }
    if (exportError) {
      showToast(exportError, 'error')
      dispatch({ type: USERS_CONSTANTS.EXPORT_USERS_RESET })
    }
  }, [exportSuccess, exportError, exportMessage, dispatch])

  const handleExport = () => {
    dispatch(exportAllUsers())
  }

  const handleWhatsAppClick = (contactNumber) => {
    if (!whatsAppMessage) {
      showToast('WhatsApp message template not found. Please set it up first.', 'error')
      return
    }
    // Format the message (replace placeholders if any)
    let formattedMessage = whatsAppMessage
      .replace(/{contact}/g, contactNumber)
      .replace(/\n/g, '\n'); // This line is optional if you already use \n correctly

    const encodedMessage = encodeURIComponent(formattedMessage.trim());
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${contactNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  return loading ? (
    <Loader />
  ) : (
    <>
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
            <Button title="Search" type="submit" color="success" btnSmall fullWidth marginBottom />
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
              btnSmall
              fullWidth
              marginBottom
            />
          </CCol>
        </CRow>
      </CForm>

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <strong>
            Users ({(currentPage - 1) * Constants.ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * Constants.ITEMS_PER_PAGE, users.totalUsersCount)} of{' '}
            {users.totalUsersCount})
          </strong>
          <Button
            title={exportLoading ? 'Starting export...' : 'Export All Users'}
            onClick={handleExport}
            type="button"
            color="success"
            btnSmall
            disabled={exportLoading}
          />
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
                  <CTableHeaderCell scope="col">Last Login</CTableHeaderCell>
                  <CTableHeaderCell scope="col">WhatsApp</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users?.users?.map((stateData, index) => (
                  <CTableRow key={index + 1} className="align-middle">
                    {/* serial number */}
                    <CTableHeaderCell scope="row">
                      {(currentPage - 1) * Constants.ITEMS_PER_PAGE + index + 1}
                    </CTableHeaderCell>
                    {/* contact number */}
                    <CTableDataCell>{stateData.contactNumber}</CTableDataCell>
                    <CTableDataCell>
                      {stateData.lastLogin ? getDateFromDateString(stateData.lastLogin) : 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell>
                      <span
                        style={{ color: '#25D366', cursor: 'pointer', fontSize: '1.5rem', display: 'inline-flex', alignItems: 'center' }}
                        onClick={() => handleWhatsAppClick(stateData.contactNumber)}
                        title="Send WhatsApp Message"
                      >
                        <CIcon icon={cibWhatsapp} size="lg" />
                      </span>
                    </CTableDataCell>
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
      </CCard>

      {/* <Modal
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
      /> */}
    </>
  )
}
