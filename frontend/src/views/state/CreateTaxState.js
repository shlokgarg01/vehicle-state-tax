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
import Pagination from '../../components/Pagination/Pagination'
import { removeUnderScoreAndCapitalize } from '../../helpers/strings'
export default function CreateTaxState({ mode, navigateTo }) {
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
    error: stateError,
    resultsPerPage,
    filteredStatesCount,
  } = useSelector((state) => state.allStates)

  const { loading: stateUpdateLoading, isUpdated } = useSelector((state) => state.state)

  const initial_state = {
    mode,
    name: '',
  }

  const [state, setState] = useState(initial_state)
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [stateToDelete, setStateToDelete] = useState(null)
  const [errors, setErrors] = useState({})

  const validateState = () => {
    let tempErrors = {}

    if (!state.name.trim()) tempErrors.name = 'State Name is required'

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
    dispatch(getTaxStates({ mode, page: currentPage }))
  }, [currentPage, dispatch, mode])

  useEffect(() => {
    if (stateCreationError) {
      if (showToast(stateCreationError, 'error')) {
        setErrors((prev) => ({ ...prev, name: stateCreationError }))
      }
      dispatch(clearErrors())
    }
    if (stateError) {
      showToast(stateError, 'error')
      dispatch(clearErrors())
    }
    if (isUpdated) {
      showToast('State Updated')
      dispatch(getTaxStates({ mode, page: currentPage }))
      dispatch(clearErrors())
    }

    if (isStateCreated) {
      showToast('State Created Successfully')
      setState(initial_state)
      dispatch(getTaxStates({ mode, page: 1 }))
      setCurrentPage(1)
      dispatch(clearErrors())
      if (navigateTo) navigate(navigateTo)
    }
  }, [isStateCreated, stateCreationError, isUpdated, navigateTo, dispatch])

  const filteredStates = states?.filter((s) => s.mode === mode)

  return stateCreationLoading || statesLoading || stateUpdateLoading ? (
    <Loader />
  ) : (
    <>
      <CCard className="mb-4">
        <CCardHeader className="fw-bold">Create New State</CCardHeader>
        {stateCreationError && (
          <p className="text-danger text-center fw-semibold">
            {typeof stateCreationError === 'string'
              ? stateCreationError
              : stateCreationError?.message || 'Something went wrong' || stateCreationError}
          </p>
        )}

        <CCardBody>
          <CForm onSubmit={handleStateCreate}>
            <CRow>
              <CCol sm={4}>
                <TextInput
                  type="text"
                  placeholder="State Name"
                  value={state.name}
                  onChange={(e) => {
                    setState({ ...state, name: e.target.value })
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: '' }))
                    }
                  }}
                  id="state"
                  label="State"
                  name="state"
                  errors={errors.name}
                />
                {errors.name && <p className="text-danger">{errors.name}</p>}
              </CCol>
            </CRow>

            <Button
              title="Create State"
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
          <strong>
            States ({(currentPage - 1) * resultsPerPage + 1}–
            {Math.min(currentPage * resultsPerPage, filteredStatesCount)} of {filteredStatesCount})
          </strong>
        </CCardHeader>

        {filteredStates.length === 0 ? (
          <NoData title="No States Found" />
        ) : (
          <CCardBody>
            <CTable striped hover responsive className="table-sm compact-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>S.No</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>active</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredStates.map((stateData, index) => (
                  <CTableRow key={stateData._id || index}>
                    <CTableDataCell>
                      {(currentPage - 1) * resultsPerPage + index + 1}
                    </CTableDataCell>
                    <CTableDataCell>{removeUnderScoreAndCapitalize(stateData.name)}</CTableDataCell>
                    <CTableDataCell>
                      <span
                        className={`badge bg-${stateData.status === Constants.STATUS.ACTIVE ? 'success' : 'secondary'}`}
                      >
                        {stateData.status}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <Button
                        title={
                          stateData.status === Constants.STATUS.ACTIVE ? 'Deactivate' : 'Activate'
                        }
                        color={stateData.status === Constants.STATUS.ACTIVE ? 'danger' : 'success'}
                        btnSmall
                        onClick={() => {
                          setStateToDelete(stateData)
                          setIsDeleteModalVisible(true)
                        }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredStatesCount / resultsPerPage)}
              itemsPerPage={resultsPerPage}
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
            stateToDelete.status === Constants.STATUS.ACTIVE
              ? Constants.STATUS.INACTIVE
              : Constants.STATUS.ACTIVE,
          )
        }}
        onClose={() => setIsDeleteModalVisible(false)}
        title={`${stateToDelete?.status === Constants.STATUS.ACTIVE ? 'Deactivate' : 'Activate'} State`}
        body={`Are you sure you want to ${stateToDelete?.status === Constants.STATUS.ACTIVE ? 'deactivate' : 'activate'} this state?`}
        closeBtnText="Close"
        submitBtnText="Yes"
        submitBtnColor="success"
      />
    </>
  )
}
