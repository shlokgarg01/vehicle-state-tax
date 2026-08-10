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
import RefundedOrder from './views/order/refundedOrder'
import WhatsAppMessage from './views/pages/WhatsAppMessage'
import AdminSettings from './views/pages/AdminSettings'
import WithdrawalList from './views/wallet/WithdrawalList'
import PushNotificationList from './views/notifications/PushNotificationList'
import ReferralList from './views/referral/ReferralList'
import { adminPath } from './utils/adminPath'

const routes = [
  { path: adminPath('/'), exact: true, name: 'Home', element: Home, adminOnly: true },

  { path: adminPath('/orders/new'), name: 'Create Price', element: newOrder },
  { path: adminPath('/orders/completed'), name: 'Create Price', element: CompleteOrder },
  { path: adminPath('/orders/refunded'), name: 'Create Price', element: RefundedOrder },
  { path: adminPath('/orders/search'), name: 'Create Price', element: searchOrder },

  { path: adminPath('/border_tax/state'), name: 'Create State', element: CreateBorderTaxState },
  { path: adminPath('/border_tax/tax_mode'), name: 'Create Tax Mode', element: CreateBorderTaxMode },
  { path: adminPath('/border_tax/price'), name: 'Create Price', element: CreateBorderTaxPrice },

  { path: adminPath('/road_tax/state'), name: 'Create State', element: CreateRoadTaxState },
  { path: adminPath('/road_tax/tax_mode'), name: 'Create Tax Mode', element: CreateRoadTaxMode },
  { path: adminPath('/road_tax/price'), name: 'Create Price', element: CreateRoadTaxPrice },

  { path: adminPath('/loading_vehicle/state'), name: 'Create State', element: CreateLoadingTaxState },
  { path: adminPath('/loading_vehicle/tax_mode'), name: 'Create Tax Mode', element: CreateLoadingTaxMode },
  { path: adminPath('/loading_vehicle/price'), name: 'Create Price', element: CreateLoadingTaxPrice },

  { path: adminPath('/all_india_permit/price'), name: 'Create Price', element: createAllIndiaPermitTax },
  { path: adminPath('/all_india_tax/price'), name: 'Create Price', element: createAllIndiaTax },
  { path: adminPath('/user'), name: 'Users ', element: userSearch },
  { path: adminPath('/referrals'), name: 'Referrals', element: ReferralList },
  { path: adminPath('/employee'), name: 'Employee ', element: EmployeeList },

  { path: adminPath('/banners/list'), name: 'List Banner ', element: BannerList },
  { path: adminPath('/whatsapp-message'), name: 'WhatsApp Message', element: WhatsAppMessage },
  { path: adminPath('/admin'), name: 'Admin', element: AdminSettings },
  {
    path: adminPath('/notifications'),
    name: 'Push Notifications',
    element: PushNotificationList,
    adminOnly: true,
  },
  {
    path: adminPath('/wallet/withdrawals'),
    name: 'Wallet Withdrawals',
    element: WithdrawalList,
    withdrawAccess: true,
  },
]

export default routes
