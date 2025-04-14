import CreateBorderTaxMode from './views/borderTax/createBorderTaxMode'
import CreateBorderTaxState from './views/borderTax/createBorderTaxState'
import CreateBorderTaxPrice from './views/borderTax/createBorderTaxPrice'
import CreateRoadTaxState from './views/roadTax/createRoadTaxState'
import CreateRoadTaxMode from './views/roadTax/createRoadTaxMode'

import Home from './views/Home/Home'

import userSearch from './views/user/userList'

import EmployeeList from './views/employee/EmployeeList'

import BannerList from './views/banner/BannerList'

import CreateLoadingTaxState from './views/loadingVehicletax/createLoadingTaxState'
import CreateLoadingTaxMode from './views/loadingVehicletax/CreateLoadingTaxMode'
import createAllIndiaPermitTax from './views/allIndiaPermit/createAllIndiaPermitTax'
import createAllIndiaTax from './views/allIndiaTax/createAllIndiaTax'
import CreateLoadingTaxPrice from './views/loadingVehicletax/CreateLoadingTaxPrice'
import CreateRoadTaxPrice from './views/roadTax/createRoadTaxPrice'
import newOrder from './views/order/newOrder'
import CompleteOrder from './views/order/completeOrder'
import searchOrder from './views/order/searchOrder'

const routes = [
  { path: '/', exact: true, name: 'Home', element: Home },

  { path: '/orders/new', name: 'Create Price', element: newOrder },
  { path: '/orders/completed', name: 'Create Price', element: CompleteOrder },
  { path: '/orders/search', name: 'Create Price', element: searchOrder },

  { path: '/border_tax/state', name: 'Create State', element: CreateBorderTaxState },
  { path: '/border_tax/tax_mode', name: 'Create Tax Mode', element: CreateBorderTaxMode },
  { path: '/border_tax/price', name: 'Create Price', element: CreateBorderTaxPrice },

  { path: '/road_tax/state', name: 'Create State', element: CreateRoadTaxState },
  { path: '/road_tax/tax_mode', name: 'Create Tax Mode', element: CreateRoadTaxMode },
  { path: '/road_tax/price', name: 'Create Price', element: CreateRoadTaxPrice },

  { path: '/loading_vehicle/state', name: 'Create State', element: CreateLoadingTaxState },
  { path: '/loading_vehicle/tax_mode', name: 'Create Tax Mode', element: CreateLoadingTaxMode },
  { path: '/loading_vehicle/price', name: 'Create Price', element: CreateLoadingTaxPrice },

  { path: '/all_india_permit/price', name: 'Create Price', element: createAllIndiaPermitTax },

  { path: '/all_india_tax/price', name: 'Create Price', element: createAllIndiaTax },

  { path: '/user', name: 'Users ', element: userSearch },

  { path: '/employee', name: 'Employee ', element: EmployeeList },

  { path: '/banners/list', name: 'List Banner ', element: BannerList },
]

export default routes
