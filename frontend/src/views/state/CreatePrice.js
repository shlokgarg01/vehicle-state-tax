import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useMemo, useCallback } from 'react'
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
import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import Pagination from '../../components/Pagination/Pagination'
import NoData from '../../components/NoData'
import Loader from '../../components/Loader/Loader'

import { showToast } from '../../utils/toast'

import { getAllPrices } from '../../actions/priceAction'

const CreatePrice = ({
  states,
  onSubmit,
  editingPrice,
  error,
  loading,
  mode,
  stateLoading,
  stateError,
}) => {
  //  Initial State Setup
  const initialForm = {
    state: '',
    mode: mode,
    taxMode: '',
    seatCapacity: '',
    price1: '',
    price2: '',
    serviceCharge: 0,
    status: Constants.STATUS.ACTIVE,
    vehicleType: '',
    weight: '',
  }

  // local state
  const [formData, setFormData] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const limit = Constants.ITEMS_PER_PAGE

  //  Redux State
  const dispatch = useDispatch()
  const { loading: listLoading, error: errorList, prices } = useSelector((state) => state.allPrices)

  // effect
  useEffect(() => {
    if (editingPrice) {
      setFormData(editingPrice)
    }
  }, [editingPrice])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      mode: mode,
    }))
  }, [])

  useEffect(() => {
    dispatch(getAllPrices({ page: currentPage, perPage: limit, mode }))
  }, [dispatch, currentPage])

  const validateForm = () => {
    const errors = {}

    const isAllIndia =
      mode === Constants.MODES.ALL_INDIA_PERMIT || mode === Constants.MODES.ALL_INDIA_TAX

    // State required unless it's All India mode
    if (!isAllIndia && !formData.state) {
      errors.state = 'State is required'
    }

    // Tax Mode
    if (!formData.taxMode) {
      errors.taxMode = 'Tax Mode is required'
    }

    // Seat Capacity
    if (!formData.seatCapacity) {
      errors.seatCapacity = 'Seat capacity is required'
    }

    // Price 1
    if (!formData.price1 || parseFloat(formData.price1) <= 0) {
      errors.price1 = 'Valid Price 1 is required'
    }

    // Price 2 only if tax mode is 'DAYS'
    if (formData.taxMode === Constants.TAX_MODES.DAYS) {
      if (!formData.price2 || parseFloat(formData.price2) <= 0) {
        errors.price2 = 'Valid Price 2 is required for Daily tax mode'
      }
    }

    // Vehicle Type & Weight only in Vehicle Type mode
    if (mode === Constants.MODES.VEHICLE_TYPE) {
      if (!formData.vehicleType) {
        errors.vehicleType = 'Vehicle type is required'
      }
      if (!formData.weight || parseFloat(formData.weight) <= 0) {
        errors.weight = 'Valid weight is required'
      }
    }

    // Service charge optional but validate if present
    if (formData.serviceCharge && parseFloat(formData.serviceCharge) < 0) {
      errors.serviceCharge = 'Service charge cannot be negative'
    }

    return errors
  }
  // Form Helpers
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReset = () => {
    setFormData(initialForm)

    setFormErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      const payload = { ...formData }

      if (!payload.taxMode || !payload.price2) delete payload.price2
      if (!payload.vehicleType) delete payload.vehicleType
      if (!payload.weight) delete payload.weight

      const result = await onSubmit(payload)
      showToast('Price submitted successfully', 'success')

      if (result?.success) {
        setFormData(initialForm)
        setFormErrors({})
        dispatch(getAllPrices({ page: currentPage, perPage: limit, mode }))
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Something went wrong while submitting'
      showToast(message, 'error')
    }
  }

  //  Derived Data
  const filteredPrices = useMemo(() => {
    const filtered = prices?.prices?.filter((price) => price.mode === mode) || []
    return filtered
  }, [prices?.prices, mode])

  const allowedTaxModes = useMemo(() => {
    return mode === Constants.MODES.ALL_INDIA_TAX || mode === Constants.MODES.ALL_INDIA_PERMIT
      ? [Constants.TAX_MODES.YEARLY]
      : Object.values(Constants.TAX_MODES)
  }, [mode])

  const isVehicleTypeMode = useMemo(() => {
    return mode === Constants.MODES.VEHICLE_TYPE
  }, [mode])

  const getModeLabel = useCallback((modeKey) => {
    return (
      Object.entries(Constants.MODES)
        .find(([_, val]) => val === modeKey)?.[0]
        ?.replace(/_/g, ' ')
        ?.toLowerCase()
        ?.replace(/^\w/, (c) => c.toUpperCase()) || 'Price'
    )
  }, [])

  return (
    <>
      {/* Form Card */}
      <CCard className="mb-4">
        <CCardHeader className="fw-bold">Create {getModeLabel(mode)} Price</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="justify-content-center">
              <CCol md={8}>
                {/* Form Error Message */}
                {error && (
                  <p className="text-danger text-center fw-semibold">
                    {typeof error === 'string'
                      ? error
                      : error?.data?.message || 'Something went wrong'}
                  </p>
                )}

                {/* Field: State (if not All India Mode) */}
                {mode !== Constants.MODES.ALL_INDIA_PERMIT &&
                  mode !== Constants.MODES.ALL_INDIA_TAX && (
                    <>
                      {stateLoading ? (
                        <p className="text-center text-info">Loading states...</p>
                      ) : stateError ? (
                        <p className="text-center text-danger">{stateError}</p>
                      ) : (
                        <SelectBox
                          id="state"
                          name="state"
                          label="State"
                          value={formData.state}
                          onChange={handleChange}
                          defaultOption="-- Select State --"
                          options={states
                            .filter((state) => state.mode === mode)
                            .map((state) => ({
                              value: state._id,
                              key: state._id,
                              label: state.name,
                            }))}
                          errors={formErrors}
                        />
                      )}
                    </>
                  )}

                {/* Field: Tax Mode */}
                <SelectBox
                  id="taxMode"
                  name="taxMode"
                  label="Tax Mode"
                  value={formData.taxMode}
                  onChange={handleChange}
                  defaultOption="-- Select Tax Mode --"
                  options={allowedTaxModes.map((tm) => ({
                    value: tm,
                    key: tm,
                    label: tm,
                  }))}
                  errors={formErrors}
                />

                {/* Field: Seat Capacity */}
                <SelectBox
                  id="seatCapacity"
                  name="seatCapacity"
                  label="Seat Capacity"
                  value={formData.seatCapacity}
                  onChange={handleChange}
                  defaultOption="-- Select Seat Capacity --"
                  options={Object.values(Constants.SEAT_CAPACITY).map((seat) => ({
                    value: seat,
                    key: seat,
                    label: seat,
                  }))}
                  errors={formErrors}
                />

                {/* Field: Vehicle Type (if applicable) */}
                {isVehicleTypeMode && (
                  <SelectBox
                    id="vehicleType"
                    name="vehicleType"
                    label="Vehicle Type"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    defaultOption="-- Select Vehicle Type --"
                    options={Object.values(Constants.VEHICLE_TYPES).map((vt) => ({
                      value: vt,
                      key: vt,
                      label: vt,
                    }))}
                    errors={formErrors}
                  />
                )}

                {/* Field: Weight (if applicable) */}
                {isVehicleTypeMode && (
                  <TextInput
                    type="number"
                    name="weight"
                    label="Weight"
                    value={formData.weight}
                    onChange={handleChange}
                    errors={formErrors}
                  />
                )}

                {/* Field: Price 1 */}
                <TextInput
                  type="number"
                  name="price1"
                  label="Price 1"
                  value={formData.price1}
                  onChange={handleChange}
                  errors={formErrors}
                />

                {/* Field: Price 2 (only for Days tax mode) */}
                {formData.taxMode === Constants.TAX_MODES.DAYS && (
                  <TextInput
                    type="number"
                    name="price2"
                    label="Price 2"
                    value={formData.price2}
                    onChange={handleChange}
                  />
                )}

                {/* Field: Service Charge */}
                <TextInput
                  type="number"
                  name="serviceCharge"
                  label="Service Charge"
                  value={formData.serviceCharge}
                  onChange={handleChange}
                />

                {/* Field: Status */}
                <SelectBox
                  id="status"
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleChange}
                  defaultOption="-- Select Status --"
                  options={Object.values(Constants.STATUS).map((stat) => ({
                    value: stat,
                    key: stat,
                    label: stat,
                  }))}
                />

                {/* Buttons */}
                <div className="d-flex justify-content-center gap-2 pb-4 mt-3">
                  <Button color="danger" type="button" onClick={handleReset} title="Reset" />
                  <Button
                    color="success"
                    type="submit"
                    disabled={loading}
                    title={loading ? <CSpinner size="sm" /> : 'Create Price'}
                  />
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Price List Table */}
      <CCard>
        <CCardHeader>
          <strong>
            Price List ({(currentPage - 1) * limit + 1}–
            {Math.min(currentPage * limit, prices?.filteredCount || 0)} of{' '}
            {prices?.filteredCount || 0})
          </strong>
        </CCardHeader>

        {listLoading ? (
          <div className="text-center py-4">
            <Loader />
          </div>
        ) : errorList ? (
          <p className="text-danger text-center fw-semibold">{errorList}</p>
        ) : !filteredPrices.length ? (
          <NoData title="No Prices Found" />
        ) : (
          <CCardBody>
            <CTable striped hover responsive className="table-sm compact-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>S.No</CTableHeaderCell>
                  <CTableHeaderCell>State</CTableHeaderCell>
                  <CTableHeaderCell>Mode</CTableHeaderCell>
                  <CTableHeaderCell>Tax Mode</CTableHeaderCell>
                  <CTableHeaderCell>Seat Capacity</CTableHeaderCell>
                  <CTableHeaderCell>Price 1</CTableHeaderCell>
                  <CTableHeaderCell>Price 2</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredPrices.map((price, index) => (
                  <CTableRow key={price._id}>
                    <CTableDataCell>{(currentPage - 1) * limit + index + 1}</CTableDataCell>
                    <CTableDataCell>{price.state?.name || '-'}</CTableDataCell>
                    <CTableDataCell>{getModeLabel(price.mode)}</CTableDataCell>
                    <CTableDataCell>{price.taxMode || '-'}</CTableDataCell>
                    <CTableDataCell>{price.seatCapacity || '-'}</CTableDataCell>
                    <CTableDataCell>₹{parseFloat(price.price1 || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>
                      {price.price2 ? `₹${parseFloat(price.price2).toFixed(2)}` : '-'}
                    </CTableDataCell>
                    <CTableDataCell>
                      <span
                        className={`badge bg-${
                          price.status === 'active' ? 'success' : 'secondary'
                        }`}
                      >
                        {price.status}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <Pagination
              currentPage={currentPage}
              totalPages={prices?.totalPages || 1}
              itemsPerPage={prices?.perPage || limit}
              onPageChange={setCurrentPage}
            />
          </CCardBody>
        )}
      </CCard>
    </>
  )
}

export default CreatePrice
