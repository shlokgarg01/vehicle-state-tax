import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'

import * as userReducer from './reducers/userReducer'
import * as taxReducer from './reducers/taxReducer'
import * as taxUserReducer from './reducers/usersReducer'
import * as employeeReducer from './reducers/employeeReducer'
import * as bannerReducer from './reducers/bannerReducer'
import * as taxModeReducer from './reducers/taxModeReducer'
import * as priceReducer from './reducers/priceReducer'
import * as orderReducer from './reducers/orderReducer'

const initialState = { sidebarShow: true }

const toggleSidebar = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  sidebarShow: toggleSidebar,

  user: userReducer.loadUserReducer,

  users: taxUserReducer.usersReducer,
  deleteUser: taxUserReducer.deleteSingleUser,

  createEmployee: employeeReducer.createEmployeeReducer,
  getEmployee: employeeReducer.employeeGetReducer,
  deleteEmployee: employeeReducer.employeeDeleteReducer,
  updateEmployee: employeeReducer.updateSingleEmployee,

  createBanner: bannerReducer.createBannerReducer,
  bannerList: bannerReducer.getBannerReducer,
  deleteBanner: bannerReducer.deleteBannerReducer,

  createState: taxReducer.createStateReducer,
  allStates: taxReducer.allStatesReducer,
  state: taxReducer.updateStateReducer,

  createTaxMode: taxModeReducer.createTaxModeReducer,
  updateTaxMode: taxModeReducer.updateTaxModeReducer,
  allTaxModes: taxModeReducer.allTaxModesReducer,
  deleteTaxMode: taxModeReducer.deleteTaxModeReducer,

  createPrice: priceReducer.createPriceReducer,
  allPrices: priceReducer.priceListReducer,
  updatePrice: priceReducer.updatePriceReducer,
  deletePrice: priceReducer.deletePriceReducer,

  createTax: orderReducer.createTaxReducer,
  allTaxes: orderReducer.allTaxesReducer,
  uploadTax: orderReducer.uploadTaxReducer,
})

// ✅ persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Only persist the user state
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)))

const persistor = persistStore(store)

export { store, persistor }
