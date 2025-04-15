// fieldConfigs.js

import Constants from '../../utils/constants'

const fieldConfigs = {
  state: {
    id: 'state',
    type: 'select',
    label: 'State',
    getOptions: (_, extraData = {}) =>
      (extraData.states || [])
        .filter((s) => s.mode === extraData.mode && s.status === Constants.STATUS.ACTIVE)
        .map((s) => ({
          value: s._id,
          key: s._id,
          label: s.name,
        })),
    show: (_, extraData = {}) =>
      extraData.mode !== Constants.MODES.ALL_INDIA_PERMIT &&
      extraData.mode !== Constants.MODES.ALL_INDIA_TAX,
  },

  taxMode: {
    id: 'taxMode',
    type: 'select',
    label: 'Tax Mode',
    getOptions: (_, extraData = {}) =>
      (extraData.taxModes || []).map((tm) => ({
        value: tm,
        key: tm,
        label: tm,
      })),
  },

  seatCapacity: {
    id: 'seatCapacity',
    type: 'select',
    label: 'Seat Capacity',
    show: (_, __, isVehicleTypeMode = false) => !isVehicleTypeMode,
    options: Object.values(Constants.SEAT_CAPACITY).map((val) => ({
      value: val,
      key: val,
      label: val,
    })),
  },

  vehicleType: {
    id: 'vehicleType',
    type: 'select',
    label: 'Vehicle Type',
    show: (_, __, isVehicleTypeMode = false) => isVehicleTypeMode,
    options: Object.values(Constants.VEHICLE_TYPES).map((val) => ({
      value: val,
      key: val,
      label: val,
    })),
  },

  weight: {
    id: 'weight',
    type: 'select',
    label: 'Weight',
    show: (_, __, isVehicleTypeMode = false) => isVehicleTypeMode,
    options: Object.entries(Constants.WEIGHT).map(([_, val]) => ({
      value: val,
      label: val.toString(),
    })),
  },

  price1: {
    id: 'price1',
    type: 'number',
    label: 'Price 1',
  },

  price2: {
    id: 'price2',
    type: 'number',
    label: 'Price 2',
    show: (_, formData = {}) => formData.taxMode === Constants.TAX_MODES.DAYS,
  },

  serviceCharge: {
    id: 'serviceCharge',
    type: 'number',
    label: 'Service Charge',
  },

  mobileNumber: {
    id: 'mobileNumber',
    type: 'number',
    label: 'Mobile Number',
  },

  extraCharge: {
    id: 'extraCharge',
    type: 'number',
    label: 'Extra Charge',
  },

  lateFee: {
    id: 'lateFee',
    type: 'number',
    label: 'Late Fee',
  },

  penalty: {
    id: 'penalty',
    type: 'number',
    label: 'Penalty',
  },

  discount: {
    id: 'discount',
    type: 'number',
    label: 'Discount',
  },
}

export default fieldConfigs
