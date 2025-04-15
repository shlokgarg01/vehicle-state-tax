import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'

// Reducer Imports
import * as userReducer from './reducers/userReducer'
import * as taxReducer from './reducers/taxReducer'
import * as taxUserReducer from './reducers/usersReducer'
import * as employeeReducer from './reducers/employeeReducer'
import * as bannerReducer from './reducers/bannerReducer'
import * as taxModeReducer from './reducers/taxModeReducer'
import * as priceReducer from './reducers/priceReducer'
import * as orderReducer from './reducers/orderReducer'

// Sidebar Reducer
const initialSidebarState = { sidebarShow: true }
const toggleSidebar = (state = initialSidebarState, action) => {
  switch (action.type) {
    case 'set':
      return { ...state, ...action }
    default:
      return state
  }
}

// Root Reducer
const rootReducer = combineReducers({
  sidebarShow: toggleSidebar,

  // Auth & Users
  user: userReducer.loadUserReducer,
  users: taxUserReducer.usersReducer,
  deleteUser: taxUserReducer.deleteSingleUser,

  // Employee
  createEmployee: employeeReducer.createEmployeeReducer,
  getEmployee: employeeReducer.employeeGetReducer,
  deleteEmployee: employeeReducer.employeeDeleteReducer,
  updateEmployee: employeeReducer.updateSingleEmployee,

  // Banners
  createBanner: bannerReducer.createBannerReducer,
  bannerList: bannerReducer.getBannerReducer,
  deleteBanner: bannerReducer.deleteBannerReducer,

  // States
  createState: taxReducer.createStateReducer,
  allStates: taxReducer.allStatesReducer,
  state: taxReducer.updateStateReducer,

  // Tax Modes
  createTaxMode: taxModeReducer.createTaxModeReducer,
  updateTaxMode: taxModeReducer.updateTaxModeReducer,
  allTaxModes: taxModeReducer.allTaxModesReducer,

  // Prices
  createPrice: priceReducer.createPriceReducer,
  allPrices: priceReducer.priceListReducer,
  updatePrice: priceReducer.updatePriceReducer,
  deletePrice: priceReducer.deletePriceReducer,

  // Orders / Taxes
  createTax: orderReducer.createTaxReducer,
  allTaxes: orderReducer.allTaxesReducer,
  uploadTax: orderReducer.uploadTaxReducer,
})

// ✅ Persist Config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Persist only auth state
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// ✅ Store Creation
const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)))

const persistor = persistStore(store)

export { store, persistor }
