import CreateBorderTaxMode from './views/borderTax/createBorderTaxMode'
import CreateBorderTaxState from './views/borderTax/createBorderTaxState'
import CreateBorderTaxPrice from './views/borderTax/createBorderTaxPrice'

import CreateRoadTaxState from './views/roadTax/createRoadTaxState'
import CreateRoadTaxMode from './views/roadTax/createRoadTaxMode'
import CreateRoadTaxPrice from './views/roadTax/createRoadTaxPrice'

import Home from './views/Home/Home'
import userSearch from './views/user/userSearch'
import EmployeeList from './views/employee/EmployeeList'

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
]

export default routes
