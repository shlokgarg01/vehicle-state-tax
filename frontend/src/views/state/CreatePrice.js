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

import {
  getAllPrices,
  updatePrice,
  clearPriceErrors,
  createPrice,
  deletePrice,
} from '../../actions/priceAction'
import Constants from '../../utils/constants'
import { removeUnderScoreAndCapitalize } from '../../helpers/strings'

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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [priceToDelete, setPriceToDelete] = useState(null)
  const handleDeletePrice = useCallback(() => {
    if (!priceToDelete) return
    dispatch(deletePrice(priceToDelete._id))
    setIsDeleteModalVisible(false)
    setPriceToDelete(null)
  }, [dispatch, priceToDelete])

  const limit = Constants.ITEMS_PER_PAGE
  const { isDeleted, error: deleteError } = useSelector((state) => state.deletePrice)
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
    if (isDeleted) {
      showToast('Price deleted successfully', 'success')
      dispatch(
        getAllPrices({
          page: currentPage,
          perPage: limit,
          mode,
        }),
      )
    }
  }, [isDeleted, dispatch, mode, currentPage])

  useEffect(() => {
    if (deleteError) {
      showToast(deleteError?.data?.message || 'Failed to delete price', 'error')
    }
  }, [deleteError])
  useEffect(() => {
    if (errorCreate) {
      showToast(
        errorCreate?.data?.message ||
          errorCreate ||
          errorCreate?.response?.data?.message ||
          'Failed to create price',
        'error',
      )
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

    if (!formData.price1) {
      errors.price1 = 'Price 1 is required'
    } else if (isNaN(formData.price1) || formData.price1 <= 0) {
      errors.price1 = 'Price 1 must be a valid positive number'
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

      // Check if the weight exists
      if (!formData.weight) {
        errors.weight = 'Weight is required'
      }
    }

    if (
      formData.serviceCharge === undefined ||
      formData.serviceCharge === null ||
      formData.serviceCharge.toString().trim() === ''
    ) {
      errors.serviceCharge = 'Service charge is required'
    } else {
      const value = parseFloat(formData.serviceCharge)

      if (isNaN(value)) {
        errors.serviceCharge = 'Service charge must be a valid number'
      } else if (value < 1) {
        errors.serviceCharge = 'Service charge cannot be negative'
      }
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

    // Validate form data
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

      // Show success message first

      // Now dispatch the createPrice action
      const result = dispatch(createPrice(payload))

      // Handle the result from the dispatch (success or failure)
      if (result?.success) {
        showToast('Price submitted successfully', 'success')
        handleReset()
        dispatch(getAllPrices({ page: currentPage, perPage: limit, mode }))
      }
    } catch (err) {
      // If there's an error, show the error message after the success toast
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong while submitting' ||
        error
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
    return mode === Constants.MODES.ALL_INDIA_TAX
      ? [Constants.TAX_MODES.QUARTERLY, Constants.TAX_MODES.YEARLY]
      : mode === Constants.MODES.ALL_INDIA_PERMIT
        ? [Constants.TAX_MODES.YEARLY]
        : Object.values(Constants.TAX_MODES)
  }, [mode])

  const isVehicleTypeMode = useMemo(() => mode === Constants.MODES.LOADING_VEHICLE, [mode])

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
                            .filter((state) => state.status === Constants.STATUS.ACTIVE)
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
                {!isVehicleTypeMode && (
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
                )}

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
                    options={Object.entries(Constants.WEIGHT).map(([key, value]) => ({
                      value,
                      label: value.toString(),
                    }))}
                    errors={formErrors}
                  />
                )}
                {/* Field: Price 1 */}
                <TextInput
                  type="number"
                  name="price1"
                  label="Price 1"
                  id="price1"
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
                    errors={formErrors}
                  />
                )}
                {/* Field: Service Charge */}
                <TextInput
                  type="number"
                  name="serviceCharge"
                  label="Service Charge"
                  value={formData.serviceCharge}
                  id="serviceCharge"
                  onChange={handleChange}
                  errors={formErrors.serviceCharge}
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
            {Math.min(currentPage * limit, prices?.totalPrices || 0)} of {prices?.totalPrices || 0})
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

                  {!isVehicleTypeMode && <CTableHeaderCell>Seat Capacity</CTableHeaderCell>}
                  <CTableHeaderCell>Price 1</CTableHeaderCell>
                  {!(
                    mode === Constants.MODES.ALL_INDIA_TAX ||
                    mode === Constants.MODES.ALL_INDIA_PERMIT
                  ) && <CTableHeaderCell>Price 2</CTableHeaderCell>}
                  <CTableHeaderCell>Service Charge</CTableHeaderCell>
                  {isVehicleTypeMode && <CTableHeaderCell>Vehicle Type</CTableHeaderCell>}
                  {isVehicleTypeMode && <CTableHeaderCell>Weight</CTableHeaderCell>}
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {filteredPrices.map((price, index) => (
                  <CTableRow key={price._id} className="align-middle">
                    <CTableDataCell>{(currentPage - 1) * limit + index + 1}</CTableDataCell>
                    {!(
                      mode === Constants.MODES.ALL_INDIA_TAX ||
                      mode === Constants.MODES.ALL_INDIA_PERMIT
                    ) && (
                      <CTableDataCell>
                        {removeUnderScoreAndCapitalize(price.state?.name) || '-'}
                      </CTableDataCell>
                    )}

                    <CTableDataCell>{price.taxMode || '-'}</CTableDataCell>
                    {!isVehicleTypeMode && (
                      <CTableDataCell>{price.seatCapacity || '-'}</CTableDataCell>
                    )}
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
                      <Button
                        color="danger"
                        title="Delete"
                        onClick={() => {
                          setPriceToDelete(price)
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
              totalPages={Math.ceil(prices?.totalPrices / limit)}
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
      <Modal
        visible={isDeleteModalVisible}
        onVisibleToggle={() => setIsDeleteModalVisible(!isDeleteModalVisible)}
        onSubmitBtnClick={handleDeletePrice}
        onClose={() => setIsDeleteModalVisible(false)}
        title="Confirm Deletion"
        body="Are you sure you want to delete this price?"
        closeBtnText="Close"
        submitBtnText="Delete"
        submitBtnColor="danger"
      />
    </>
  )
}

export default CreatePrice
