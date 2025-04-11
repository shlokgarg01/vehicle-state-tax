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
import { removeUserScoreAndCapitalize } from '../../helpers/strings'

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
    totalStates,
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
    dispatch(getTaxStates({ mode, page: currentPage }))
  }, [currentPage, dispatch, mode])

  useEffect(() => {
    if (stateCreationError) {
      showToast(stateCreationError, 'error')
      dispatch(clearErrors())
    }
    if (stateError) {
      showToast(stateError, 'error')
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
      if (navigateTo) navigate(navigateTo)
    }
  }, [isStateCreated, stateCreationError, isUpdated, navigateTo, dispatch])

  console.log(stateCreationError)
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
              : stateCreationError?.data?.message || 'Something went wrong' || stateCreationError}
          </p>
        )}

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
              onClick={handleStateCreate}
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
                    <CTableDataCell>{removeUserScoreAndCapitalize(stateData.name)}</CTableDataCell>
                    <CTableDataCell>
                      <span
                        className={`badge bg-${stateData.status === Constants.STATUS.ACTIVE ? 'success' : 'secondary'}`}
                      >
                        {stateData.status}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <Button
                        title="Activate"
                        color="danger"
                        size="sm"
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
        title="Delete State"
        body="Are you sure you want to update the state?"
        closeBtnText="Close"
        submitBtnText="Yes"
        submitBtnColor="success"
      />
    </>
  )
}
