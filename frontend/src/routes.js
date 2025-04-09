import CreateBorderTaxMode from './views/borderTax/createBorderTaxMode'
import CreateBorderTaxState from './views/borderTax/createBorderTaxState'
import CreateBorderTaxPrice from './views/borderTax/createBorderTaxPrice'

import CreateRoadTaxState from './views/roadTax/createRoadTaxState'
import CreateRoadTaxMode from './views/roadTax/createRoadTaxMode'
import CreateRoadTaxPrice from './views/roadTax/createRoadTaxPrice'

import Home from './views/Home/Home'
import userSearch from './views/user/userList'
import EmployeeList from './views/employee/EmployeeList'
import BannerList from './views/banner/BannerList'
import CreateBanner from './views/banner/CreateBanner'

const routes = [
  { path: '/', exact: true, name: 'Home', element: Home },

  { path: '/border_tax/state', name: 'Create State', element: CreateBorderTaxState },
  { path: '/border_tax/tax_mode', name: 'Create Tax Mode', element: CreateBorderTaxMode },
  { path: '/border_tax/price', name: 'Create Price', element: CreateBorderTaxPrice },

  { path: '/road_tax/state', name: 'Create State', element: CreateRoadTaxState },
  { path: '/road_tax/tax_mode', name: 'Create Tax Mode', element: CreateRoadTaxMode },
  { path: '/road_tax/price', name: 'Create Price', element: CreateRoadTaxPrice },

  { path: '/user', name: 'Users ', element: userSearch },
  { path: '/employee', name: 'Employee ', element: EmployeeList },
  { path: '/banners/list', name: 'List Banner ', element: BannerList },
  { path: '/banners/create', name: 'create Banner ', element: CreateBanner },
]

export default routes
