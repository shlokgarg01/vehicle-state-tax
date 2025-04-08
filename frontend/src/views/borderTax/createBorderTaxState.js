/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createTaxState, clearErrors, getTaxStates, updateState } from '../../actions/taxActions'
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
import Constants from '../../utils/constants'
import { showToast } from '../../utils/toast'
import NoData from '../../components/NoData'
import StatusBadge from '../../components/StatusBadge'
import Pagination from '../../components/Pagination/Pagination'
import { removeUserScoreAndCapitalize } from '../../helpers/strings'

export default function CreateBorderTaxState() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    loading: stateCreationLoading,
    isStateCreated,
    error: stateCreationError,
  } = useSelector((state) => state.createState)
  const {
    loading: statesLoading,
    states,
    totalStates,
    resultsPerPage,
  } = useSelector((state) => state.allStates)
  const { loading: stateUpdateLoading, isUpdated } = useSelector((state) => state.state)

  const initial_state = {
    mode: Constants.MODES.BORDER_TAX,
    name: '',
  }

  const [state, setState] = useState(initial_state)
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [stateToDelete, setStateToDelete] = useState(null)
  const [errors, setErrors] = useState({})

  const validateState = () => {
    let tempErrors = {}

    if (!state.name) tempErrors.name = 'State Name is required'
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const toggleStateStatus = (id, newStatus) => {
    dispatch(updateState(id, { status: newStatus }))
    setIsDeleteModalVisible(false)
  }

  const handleStateCreate = (e) => {
    e.preventDefault()
    setErrors({})

    if (validateState()) dispatch(createTaxState(state))
  }

  useEffect(() => {
    if (stateCreationError) {
      showToast(stateCreationError, 'error')
      dispatch(clearErrors())
    }

    if (isUpdated) {
      showToast('State Updated')
      dispatch(clearErrors())
    }

    if (isStateCreated) {
      showToast('State Created Successfully')
      setState(initial_state)
      dispatch(clearErrors())
      navigate('/border_tax/state')
    }

    dispatch(getTaxStates({ mode: Constants.MODES.BORDER_TAX, page: currentPage }))
  }, [currentPage, dispatch, isStateCreated, stateCreationError, isUpdated])

  return stateCreationLoading || statesLoading || stateUpdateLoading ? (
    <Loader />
  ) : (
    <>
      <CCard className="mb-4">
        <CCardHeader className="fw-bold">Create New State</CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol sm={4}>
                <TextInput
                  type="text"
                  placeholder="State Name"
                  value={state.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                  id="name"
                  label="Name"
                  errors={errors}
                />
              </CCol>
            </CRow>

            <Button
              title="Create State"
              onClick={(e) => handleStateCreate(e)}
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
          <strong>States ({totalStates})</strong>
        </CCardHeader>
        {states?.length === 0 ? (
          <NoData title="No States Found" />
        ) : (
          <CCardBody>
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {states?.map((stateData, index) => {
                  return (
                    <CTableRow key={index + 1}>
                      <CTableHeaderCell scope="row">
                        {(currentPage - 1) * resultsPerPage + index + 1}
                      </CTableHeaderCell>
                      <CTableDataCell>
                        {removeUserScoreAndCapitalize(stateData?.name)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CCol sm={8}>
                          <StatusBadge status={stateData?.status} />
                        </CCol>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CRow className="g-1">
                          <CCol sm={4}>
                            <Button
                              btnSmall
                              title={`${stateData.status === Constants.STATUS.ACTIVE ? 'Deactivate' : 'Activate'}`}
                              color={`${stateData.status === Constants.STATUS.ACTIVE ? 'danger' : 'success'}`}
                              onClick={() => {
                                setStateToDelete(stateData)
                                setIsDeleteModalVisible(true)
                              }}
                              fullWidth
                            />
                          </CCol>
                        </CRow>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
              </CTableBody>
            </CTable>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalStates / resultsPerPage)}
              onPageChange={setCurrentPage}
            />
          </CCardBody>
        )}
      </CCard>

      <Modal
        visible={isDeleteModalVisible}
        onVisibleToggle={() => setIsDeleteModalVisible(!isDeleteModalVisible)}
        onSubmitBtnClick={() => {
          toggleStateStatus(
            stateToDelete._id,
            `${stateToDelete.status === Constants.STATUS.ACTIVE ? Constants.STATUS.INACTIVE : Constants.STATUS.ACTIVE}`,
          )
        }}
        onClose={() => setIsDeleteModalVisible(false)}
        title="Delete User"
        body="Are you sure you want to update the state?"
        closeBtnText="Close"
        submitBtnText="Yes"
        submitBtnColor="success"
      />
    </>
  )
}
