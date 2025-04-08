<<<<<<< HEAD
<<<<<<< HEAD
import React from 'react'

const routes = [
  { path: '/', exact: true, name: 'Home' }
=======
=======
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
import CreateBorderTaxMode from './views/borderTax/createBorderTaxMode'
import CreateBorderTaxState from './views/borderTax/createBorderTaxState'
import CreateBorderTaxPrice from './views/borderTax/createBorderTaxPrice'

import CreateRoadTaxState from './views/roadTax/createRoadTaxState'
import CreateRoadTaxMode from './views/roadTax/createRoadTaxMode'
import CreateRoadTaxPrice from './views/roadTax/createRoadTaxPrice'

import Home from './views/Home/Home'

const routes = [
  { path: '/', exact: true, name: 'Home', element: Home },

  { path: '/border_tax/state', name: 'Create State', element: CreateBorderTaxState },
  { path: '/border_tax/tax_mode', name: 'Create Tax Mode', element: CreateBorderTaxMode },
  { path: '/border_tax/price', name: 'Create Price', element: CreateBorderTaxPrice },

  { path: '/road_tax/state', name: 'Create State', element: CreateRoadTaxState },
  { path: '/road_tax/tax_mode', name: 'Create Tax Mode', element: CreateRoadTaxMode },
  { path: '/road_tax/price', name: 'Create Price', element: CreateRoadTaxPrice },
<<<<<<< HEAD
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
=======
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
]

export default routes
