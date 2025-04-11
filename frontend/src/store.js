import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'
import * as userReducer from './reducers/userReducer'
import * as taxReducer from './reducers/taxReducer'
import * as taxUserReducer from './reducers/usersReducer'
import * as employeeReducer from './reducers/employeeReducer'
import * as bannerReducer from './reducers/bannerReducer'
import * as taxModeReducer from './reducers/taxModeReducer'
import * as priceReducer from './reducers/priceReducer'
const initialState = { sidebarShow: true }

const toggleSidebar = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const reducer = combineReducers({
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

  createPrice: priceReducer.createPriceReducer,
  allPrices: priceReducer.priceListReducer,
  updatePrice: priceReducer.updatePriceReducer,
})

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk)))
export default store
