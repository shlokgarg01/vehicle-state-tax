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
import { clearErrors, getAllTaxModes } from '../../actions/taxModeAction'
import Loader from '../../components/Loader/Loader'
import NoData from '../../components/NoData'
import Pagination from '../../components/Pagination/Pagination'

const CreateTaxMode = ({ states, onSubmit, editingTaxMode, loading, error, mode }) => {
  const dispatch = useDispatch()

  // Initial form state
  const initialForm = {
    state: '',
    mode: mode || Constants.MODES.BORDER_TAX,
    taxMode: '',
    status: Constants.STATUS.ACTIVE,
  }

  // Local states
  const [formData, setFormData] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  // redux state
  const {
    taxModes,
    filteredTaxModesCount,
    loading: listLoading,
    error: listError,
  } = useSelector((state) => state.allTaxModes)

  const {
    isCreated,
    error: errorCreate,
    loading: loadingCreate,
  } = useSelector((state) => state.taxMode)

  const filtered = (taxModes || []).filter((item) => item.mode === mode)

  // effect
  useEffect(() => {
    const filters = {}
    if (mode) filters.mode = mode
    dispatch(getAllTaxModes('', currentPage, limit, filters, mode))
  }, [dispatch, mode, currentPage])

  useEffect(() => {
    if (!loadingCreate && isCreated) {
      showToast('Tax mode created', 'success')
      dispatch(clearErrors())
      setFormData(initialForm)
      setFormErrors({})
      dispatch(getAllTaxModes('', 1, limit, mode))
      setCurrentPage(1)
    }
  }, [loadingCreate, isCreated, dispatch, mode])

  useEffect(() => {
    if (errorCreate) {
      showToast(errorCreate?.data?.message || 'Failed to create tax mode', 'error')
    }
  }, [errorCreate])

  // form handler
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const errors = {}

    // Check for state
    if (!formData.state || formData.state.trim() === '') {
      errors.state = 'Please select a state.'
    }

    // Check for taxMode
    if (!formData.taxMode || formData.taxMode.trim() === '') {
      errors.taxMode = 'Please select a tax mode.'
    }

    // Check for status
    if (!formData.status || formData.status.trim() === '') {
      errors.status = 'Please select status.'
    }

    setFormErrors(errors)

    return errors
  }

  const handleReset = () => {
    setFormData(initialForm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()

    if (Object.keys(errors).length > 0 || errorCreate?.data?.message > 0) {
      return
    }

    try {
      await onSubmit(formData)
      dispatch(getAllTaxModes(mode))
      setFormData(initialForm)
      setFormErrors({})
      dispatch(clearErrors())
    } catch (err) {
      showToast(
        err?.response?.data?.message || err?.message || 'Something went wrong while submitting',
        'error',
      )
    }
  }

  // data
  const getModeLabel = (modeKey) => {
    return (
      Object.entries(Constants.MODES)
        .find(([_, val]) => val === modeKey)?.[0]
        ?.replace(/_/g, ' ')
        ?.toLowerCase()
        ?.replace(/^\w/, (c) => c.toUpperCase()) || 'Tax Mode'
    )
  }

  const allowedTaxModes =
    mode === Constants.MODES.ALL_INDIA_PERMIT || mode === Constants.MODES.ALL_INDIA_TAX
      ? [Constants.TAX_MODES.YEARLY]
      : Object.values(Constants.TAX_MODES)

  return (
    <>
      {/* Form Card */}
      <CCard className="mb-4">
        <CCardHeader className="fw-bold">Create {getModeLabel(mode)}</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="justify-content-center">
              <CCol md={8}>
                {/* Error message */}
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
                <CRow className="mb-3 align-items-center">
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
                </CRow>

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
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredTaxModesCount / limit)}
              itemsPerPage={limit}
              onPageChange={setCurrentPage}
            />
          </CCardBody>
        )}
      </CCard>
    </>
  )
}

export default CreateTaxMode
