import { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CRow,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

import Constants from '../../utils/constants'
import SelectBox from '../../components/Form/SelectBox'
import Button from '../../components/Form/Button'
import { showToast } from '../../utils/toast'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearErrors,
  getAllTaxModes,
  createTaxMode,
  updateTaxMode,
} from '../../actions/taxModeAction'
import Loader from '../../components/Loader/Loader'
import NoData from '../../components/NoData'
import Pagination from '../../components/Pagination/Pagination'
import Modal from '../../components/Modal/Modal'

const CreateTaxMode = ({ states, mode }) => {
  const dispatch = useDispatch()

  // Initial form state
  const initialForm = {
    state: '',
    mode: mode,
    taxMode: '',
    status: Constants.STATUS.ACTIVE,
  }

  const [formData, setFormData] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const limit = Constants.ITEMS_PER_PAGE
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [stateToDelete, setStateToDelete] = useState(null)

  // Redux states
  const {
    taxModes,
    filteredTaxModesCount,
    loading: listLoading,
    error: listError,
  } = useSelector((state) => state.allTaxModes)
  const {
    isUpdated,
    loading: updateLoading,
    error: updateError,
  } = useSelector((state) => state.updateTaxMode)
  const {
    isCreated,
    error: errorCreate,
    loading: loadingCreate,
  } = useSelector((state) => state.createTaxMode)

  const filtered = (taxModes || []).filter(
    (item) => item.mode === mode && item.state && item.state._id,
  )

  useEffect(() => {
    const filters = {}
    if (mode) filters.mode = mode
    dispatch(getAllTaxModes('', currentPage, limit, filters, { mode }))
  }, [dispatch, mode, currentPage])

  useEffect(() => {
    if (!loadingCreate && isCreated) {
      dispatch(clearErrors())
      setFormData(initialForm)
      setFormErrors({})
      const filters = {}
      if (mode) filters.mode = mode
      dispatch(getAllTaxModes('', 1, limit, filters, { mode }))
      setCurrentPage(1)
      showToast('Tax mode created', 'success')
    }
  }, [loadingCreate, isCreated, dispatch])

  useEffect(() => {
    if (errorCreate) {
      showToast(errorCreate?.data?.message || 'Failed to create tax mode', 'error')
    }
  }, [errorCreate])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedValue = ['taxMode', 'mode'].includes(name) ? value.toLowerCase() : value
    setFormData((prev) => ({ ...prev, [name]: updatedValue }))
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.state || formData.state.trim() === '') {
      errors.state = 'Please select a state.'
    }

    if (!formData.taxMode || formData.taxMode.trim() === '') {
      errors.taxMode = 'Please select a tax mode.'
    }

    if (!formData.status || formData.status.trim() === '') {
      errors.status = 'Please select status.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleReset = () => {
    setFormData(initialForm)
    setFormErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid = validateForm()

    if (!isValid) return

    dispatch(createTaxMode(formData))
  }

  const getModeLabel = (modeKey) => {
    return (
      Object.entries(Constants.MODES)
        .find(([_, val]) => val === modeKey)?.[0]
        ?.replace(/_/g, ' ')
        ?.toLowerCase()
        ?.replace(/^\w/, (c) => c.toUpperCase()) || 'Tax Mode'
    )
  }

  const toggleStateStatus = (id, newStatus) => {
    const existing = taxModes.find((tm) => tm._id === id)
    if (!existing) return

    if (!existing.state?._id) {
      showToast('Cannot update tax mode with missing state', 'error')
      return
    }

    dispatch(
      updateTaxMode(id, {
        state: existing.state._id,
        mode: existing.mode,
        taxMode: existing.taxMode,
        status: newStatus,
      }),
    )
  }

  const allowedTaxModes =
    mode === Constants.MODES.ALL_INDIA_PERMIT || mode === Constants.MODES.ALL_INDIA_TAX
      ? [Constants.TAX_MODES.YEARLY]
      : Object.values(Constants.TAX_MODES)
  useEffect(() => {
    if (!updateLoading && isUpdated) {
      showToast('Tax mode status updated', 'success')
      setIsDeleteModalVisible(false)
      dispatch(clearErrors())

      const filters = {}
      if (mode) filters.mode = mode
      dispatch(getAllTaxModes('', currentPage, limit, filters, { mode }))
    }
  }, [isUpdated, updateLoading, dispatch, currentPage, limit, mode])
  useEffect(() => {
    if (updateError) {
      showToast(updateError?.data?.message || 'Failed to update status', 'error')
    }
  }, [updateError])

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="fw-bold">Create {getModeLabel(mode)}</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="justify-content-center">
              <CCol md={8}>
                {formErrors &&
                  Object.entries(formErrors).map(([key, msg]) => (
                    <div key={key} className="text-danger mt-1">
                      {msg}
                    </div>
                  ))}

                {errorCreate && (
                  <p className="text-danger text-center fw-semibold">
                    {typeof errorCreate === 'string'
                      ? errorCreate
                      : errorCreate?.data?.message || 'Something went wrong' || errorCreate}
                  </p>
                )}

                {/* State Field */}
                <CRow className="mb-3 align-items-center">
                  <CCol md={3}>
                    <label htmlFor="state" className="form-label fw-semibold">
                      State
                    </label>
                  </CCol>
                  <CCol md={9}>
                    <SelectBox
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      defaultOption="-- Select State --"
                      options={states.map((state) => ({
                        value: state._id,
                        key: state._id,
                        label: state.name,
                      }))}
                      errors={formErrors}
                    />
                  </CCol>
                </CRow>

                {/* Tax Mode Field */}
                <CRow className="mb-3 align-items-center">
                  <CCol md={3}>
                    <label htmlFor="taxMode" className="form-label fw-semibold">
                      Tax Mode
                    </label>
                  </CCol>
                  <CCol md={9}>
                    <SelectBox
                      id="taxMode"
                      name="taxMode"
                      value={formData.taxMode}
                      onChange={handleChange}
                      defaultOption="-- Select Tax Mode --"
                      options={allowedTaxModes.map((taxMode) => ({
                        value: taxMode,
                        key: taxMode,
                        label: taxMode,
                      }))}
                      errors={formErrors}
                    />
                  </CCol>
                </CRow>

                {/* Status Field */}
                {/* <CRow className="mb-3 align-items-center">
                  <CCol md={3}>
                    <label htmlFor="status" className="form-label fw-semibold">
                      Status
                    </label>
                  </CCol>
                  <CCol md={9}>
                    <SelectBox
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      defaultOption="-- Select Status --"
                      options={Object.values(Constants.STATUS).map((stat) => ({
                        value: stat,
                        key: stat,
                        label: stat,
                      }))}
                      errors={formErrors}
                    />
                  </CCol>
                </CRow> */}

                {/* Action Buttons */}
                <div className="d-flex justify-content-center gap-2 pb-4">
                  <Button color="danger" type="button" onClick={handleReset} title="Reset" />
                  <Button
                    color="success"
                    type="submit"
                    disabled={loadingCreate}
                    title={loadingCreate ? <CSpinner size="sm" /> : 'Create Tax Mode'}
                  />
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Tax Mode List */}
      <CCard>
        <CCardHeader>
          <strong>
            Tax Mode List {filteredTaxModesCount === 0 ? 0 : (currentPage - 1) * limit + 1}–
            {Math.min(currentPage * limit, filteredTaxModesCount)} of {filteredTaxModesCount}
          </strong>
        </CCardHeader>

        {listLoading ? (
          <div className="text-center py-4">
            <Loader />
          </div>
        ) : listError ? (
          <p className="text-danger text-center fw-semibold">{listError}</p>
        ) : !filtered.length ? (
          <NoData title="No Tax Modes Found" />
        ) : (
          <CCardBody>
            <CTable striped hover responsive className="table-sm compact-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>S.No</CTableHeaderCell>
                  <CTableHeaderCell>State</CTableHeaderCell>
                  <CTableHeaderCell>Mode</CTableHeaderCell>
                  <CTableHeaderCell>Tax Mode</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filtered.map((taxMode, index) => (
                  <CTableRow key={taxMode._id}>
                    <CTableDataCell>{(currentPage - 1) * limit + index + 1}</CTableDataCell>
                    <CTableDataCell>{taxMode.state?.name || '-'}</CTableDataCell>
                    <CTableDataCell>{getModeLabel(taxMode.mode)}</CTableDataCell>
                    <CTableDataCell>{taxMode.taxMode || '-'}</CTableDataCell>
                    <CTableDataCell>
                      <span
                        className={`badge bg-${taxMode.status === 'active' ? 'success' : 'secondary'}`}
                      >
                        {taxMode.status}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <Button
                        title={
                          taxMode.status === Constants.STATUS.ACTIVE ? 'Deactivate' : 'Activate'
                        }
                        color={taxMode.status === Constants.STATUS.ACTIVE ? 'danger' : 'success'}
                        btnSmall
                        onClick={() => {
                          setStateToDelete(taxMode)
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
              totalPages={Math.ceil(filteredTaxModesCount / limit)}
              itemsPerPage={limit}
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

export default CreateTaxMode
