// import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

import SelectBox from '../../components/Form/SelectBox'
import TextInput from '../../components/Form/TextInput'
import Button from '../../components/Form/Button'
import Pagination from '../../components/Pagination/Pagination'
import NoData from '../../components/NoData'
import Loader from '../../components/Loader/Loader'
import Modal from '../../components/Modal/Modal'
import { showToast } from '../../utils/toast'

import { getAllPrices, updatePrice, clearPriceErrors, createPrice } from '../../actions/priceAction'
import Constants from '../../utils/constants'

const CreatePrice = ({ states, error, loading, mode, stateLoading, stateError }) => {
  const dispatch = useDispatch()

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

  const [formData, setFormData] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [isToggleModalVisible, setIsToggleModalVisible] = useState(false)
  const [priceToToggle, setPriceToToggle] = useState(null)
  const limit = Constants.ITEMS_PER_PAGE

  const { loading: listLoading, error: errorList, prices } = useSelector((state) => state.allPrices)

  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.updatePrice)
  const {
    isCreated,
    loading: loadingCreate,
    error: errorCreate,
  } = useSelector((state) => state.createPrice)

  useEffect(() => {
    if (mode) {
      dispatch(
        getAllPrices({
          page: currentPage,
          perPage: limit,
          mode: mode,
        }),
      )
    }
  }, [dispatch, mode, currentPage])

  useEffect(() => {
    if (!loadingCreate && isCreated) {
      dispatch(clearPriceErrors())
      handleReset()
      if (mode) {
        dispatch(
          getAllPrices({
            page: currentPage,
            perPage: limit,
            mode: mode,
          }),
        )
      }
      setCurrentPage(1)
      showToast('Price created', 'success')
    }
  }, [loadingCreate, isCreated, dispatch, mode])

  useEffect(() => {
    if (errorCreate) {
      showToast(errorCreate?.data?.message || 'Failed to create price', 'error')
    }
  }, [errorCreate])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      mode,
    }))
  }, [mode])

  useEffect(() => {
    if (!updateLoading && isUpdated) {
      showToast('Price status updated', 'success')
      setIsToggleModalVisible(false)
      dispatch(clearPriceErrors())
      if (mode) {
        dispatch(
          getAllPrices({
            page: currentPage,
            perPage: limit,
            mode: mode, // you can also write just 'mode' in shorthand
          }),
        )
      }
    }
  }, [isUpdated, updateLoading, dispatch, mode, currentPage])

  useEffect(() => {
    if (updateError) {
      showToast(updateError?.data?.message || 'Failed to update price status', 'error')
    }
  }, [updateError])

  const validateForm = () => {
    const errors = {}
    const isAllIndia =
      mode === Constants.MODES.ALL_INDIA_PERMIT || mode === Constants.MODES.ALL_INDIA_TAX

    if (!isAllIndia && !formData.state) {
      errors.state = 'State is required'
    }

    if (!formData.taxMode) {
      errors.taxMode = 'Tax Mode is required'
    }

    if (!formData.seatCapacity) {
      errors.seatCapacity = 'Seat capacity is required'
    }

    if (!formData.price1 || parseFloat(formData.price1) <= 0) {
      errors.price1 = 'Valid Price 1 is required'
    }

    if (formData.taxMode === Constants.TAX_MODES.DAYS) {
      if (!formData.price2 || parseFloat(formData.price2) <= 0) {
        errors.price2 = 'Price 2 is required for Daily tax mode'
      }
    }

    if (mode === Constants.MODES.LOADING_VEHICLE) {
      if (!formData.vehicleType) {
        errors.vehicleType = 'Vehicle type is required'
      }

      const weightNum = parseFloat(formData.weight)
      if (
        !formData.weight ||
        !Constants.WEIGHT.hasOwnProperty(
          Object.keys(Constants.WEIGHT).find((key) => Constants.WEIGHT[key] === formData.weight),
        )
      ) {
        errors.weight = 'Please select a valid weight'
      }
    }

    if (formData.serviceCharge && parseFloat(formData.serviceCharge) < 0) {
      errors.serviceCharge = 'Service charge cannot be negative'
    }

    return errors
  }

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

      if (payload.taxMode !== Constants.TAX_MODES.DAYS) delete payload.price2
      if (!payload.vehicleType) delete payload.vehicleType
      if (!payload.weight) delete payload.weight

      const result = dispatch(createPrice(payload))
      showToast('Price submitted successfully', 'success')

      if (result?.success) {
        handleReset()
        dispatch(getAllPrices({ page: currentPage, perPage: limit, mode }))
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Something went wrong while submitting'
      showToast(message, 'error')
    }
  }

  const togglePriceStatus = useCallback(
    (id, newStatus) => {
      const price = prices?.prices?.find((p) => p._id === id)
      if (!price) return
      dispatch(updatePrice(id, { ...price, status: newStatus }))
    },
    [dispatch, prices],
  )

  const filteredPrices = useMemo(() => {
    if (!prices?.prices) return []
    return mode ? prices.prices.filter((price) => price.mode === mode) : prices.prices
  }, [prices?.prices, mode])

  const allowedTaxModes = useMemo(() => {
    return mode === Constants.MODES.ALL_INDIA_TAX || mode === Constants.MODES.ALL_INDIA_PERMIT
      ? [Constants.TAX_MODES.YEARLY]
      : Object.values(Constants.TAX_MODES)
  }, [mode])

  const isVehicleTypeMode = useMemo(() => mode === Constants.MODES.LOADING_VEHICLE, [mode])
  console.log(isVehicleTypeMode)
  console.log(mode)
  console.log(Constants.MODES.LOADING_VEHICLE)
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
        <CCardHeader className="fw-bold">Create {getModeLabel({ mode })} Price</CCardHeader>
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
                  <SelectBox
                    id="weight"
                    name="weight"
                    label="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    defaultOption="-- Select weight Type --"
                    options={Object.entries(Constants.WEIGHT).map(([key, label]) => ({
                      value: key,
                      label,
                    }))}
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
                {/* <SelectBox
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
                /> */}

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
                  {!(
                    mode === Constants.MODES.ALL_INDIA_TAX ||
                    mode === Constants.MODES.ALL_INDIA_PERMIT
                  ) && <CTableHeaderCell>State</CTableHeaderCell>}

                  {/* <CTableHeaderCell>Mode</CTableHeaderCell> */}
                  <CTableHeaderCell>Tax Mode</CTableHeaderCell>
                  <CTableHeaderCell>Seat Capacity</CTableHeaderCell>
                  <CTableHeaderCell>Price 1</CTableHeaderCell>
                  {!(
                    mode === Constants.MODES.ALL_INDIA_TAX ||
                    mode === Constants.MODES.ALL_INDIA_PERMIT
                  ) && <CTableHeaderCell>Price 2</CTableHeaderCell>}
                  <CTableHeaderCell>Service Charge</CTableHeaderCell>
                  {isVehicleTypeMode && <CTableHeaderCell>Vehicle Type</CTableHeaderCell>}
                  {isVehicleTypeMode && <CTableHeaderCell>Weight</CTableHeaderCell>}
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {filteredPrices.map((price, index) => (
                  <CTableRow key={price._id}>
                    <CTableDataCell>{(currentPage - 1) * limit + index + 1}</CTableDataCell>
                    {!(
                      mode === Constants.MODES.ALL_INDIA_TAX ||
                      mode === Constants.MODES.ALL_INDIA_PERMIT
                    ) && <CTableDataCell>{price.state?.name || '-'}</CTableDataCell>}

                    {/* <CTableDataCell>{getModeLabel(price.mode)}</CTableDataCell> */}
                    <CTableDataCell>{price.taxMode || '-'}</CTableDataCell>
                    <CTableDataCell>{price.seatCapacity || '-'}</CTableDataCell>
                    <CTableDataCell>₹{parseFloat(price.price1 || 0).toFixed(2)}</CTableDataCell>
                    {!(
                      mode === Constants.MODES.ALL_INDIA_TAX ||
                      mode === Constants.MODES.ALL_INDIA_PERMIT
                    ) && (
                      <CTableDataCell>
                        {' '}
                        {price.price2 ? `₹${parseFloat(price.price2).toFixed(2)}` : '-'}
                      </CTableDataCell>
                    )}
                    <CTableDataCell>
                      ₹
                      {price.serviceCharge != null
                        ? parseFloat(price.serviceCharge).toFixed(2)
                        : '0.00'}
                    </CTableDataCell>
                    {isVehicleTypeMode && (
                      <CTableDataCell>{price.vehicleType || '-'}</CTableDataCell>
                    )}
                    {isVehicleTypeMode && (
                      <CTableDataCell>{price.weight != null ? price.weight : '-'}</CTableDataCell>
                    )}
                    <CTableDataCell>
                      <span
                        className={`badge bg-${price.status === 'active' ? 'success' : 'secondary'}`}
                      >
                        {price.status}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <Button
                        title={price.status === Constants.STATUS.ACTIVE ? 'Deactivate' : 'Activate'}
                        color={price.status === Constants.STATUS.ACTIVE ? 'danger' : 'success'}
                        btnSmall
                        onClick={() => {
                          setPriceToToggle(price)
                          setIsToggleModalVisible(true)
                        }}
                      />
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
      <Modal
        visible={isToggleModalVisible}
        onVisibleToggle={() => setIsToggleModalVisible(!isToggleModalVisible)}
        onSubmitBtnClick={() => {
          togglePriceStatus(
            priceToToggle._id,
            priceToToggle.status === Constants.STATUS.ACTIVE
              ? Constants.STATUS.INACTIVE
              : Constants.STATUS.ACTIVE,
          )
        }}
        onClose={() => setIsToggleModalVisible(false)}
        title={`${
          priceToToggle?.status === Constants.STATUS.ACTIVE ? 'Deactivate' : 'Activate'
        } Price`}
        body={`Are you sure you want to ${
          priceToToggle?.status === Constants.STATUS.ACTIVE ? 'deactivate' : 'activate'
        } this price?`}
        closeBtnText="Close"
        submitBtnText="Yes"
        submitBtnColor="success"
      />
    </>
  )
}

export default CreatePrice
