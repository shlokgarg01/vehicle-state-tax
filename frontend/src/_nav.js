import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDrop,
  cilPuzzle,
  cilSpeedometer,
  cilCalculator,
  cilStar,
  cilChartPie,
  cilBell,
  cilTruck,
  cilMoney,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
import Constants from './utils/constants'
import { adminPath } from './utils/adminPath'

const _nav = (user) => {
  const role = user?.role
  const isAdmin = role === Constants.ROLES.ADMIN
  const isManager = role === Constants.ROLES.MANAGER
  const canWithdraw = isAdmin || Boolean(user?.canWithdraw)

  return [
    isAdmin && {
      component: CNavItem,
      name: 'Home',
      to: adminPath('/'),
      icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    },
    isManager && {
      component: CNavItem,
      name: 'New Orders',
      to: adminPath('/orders/new'),
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    },
    isManager && {
      component: CNavItem,
      name: 'Completed Orders',
      to: adminPath('/orders/completed'),
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    isManager && {
      component: CNavItem,
      name: 'Refunded Orders',
      to: adminPath('/orders/refunded'),
      icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />
    },
    isManager && {
      component: CNavItem,
      name: 'Search Orders',
      to: adminPath('/orders/search'),
      icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Orders',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'New Orders',
          to: adminPath('/orders/new'),
        },
        {
          component: CNavItem,
          name: 'Completed Orders',
          to: adminPath('/orders/completed'),
        },
        {
          component: CNavItem,
          name: 'Refunded Orders',
          to: adminPath('/orders/refunded'),
        },
        {
          component: CNavItem,
          name: 'Search Orders',
          to: adminPath('/orders/search'),
        },
      ],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Users',
      to: adminPath('/users'),
      icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
      items: [{ component: CNavItem, name: 'All users', to: adminPath('/user') }],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Employees',

      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      items: [{ component: CNavItem, name: 'All employee', to: adminPath('/employee') }],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Banners',

      icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
      items: [{ component: CNavItem, name: 'All banner', to: adminPath('/banners/list') }],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Border Tax',
      icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Create State',
          to: adminPath('/border_tax/state'),
        },
        {
          component: CNavItem,
          name: 'Create Tax Mode',
          to: adminPath('/border_tax/tax_mode'),
        },
        {
          component: CNavItem,
          name: 'Create Price',
          to: adminPath('/border_tax/price'),
        },
      ],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Road Tax',
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Create State',
          to: adminPath('/road_tax/state'),
        },
        {
          component: CNavItem,
          name: 'Create Tax Mode',
          to: adminPath('/road_tax/tax_mode'),
        },
        {
          component: CNavItem,
          name: 'Create Price',
          to: adminPath('/road_tax/price'),
        },
      ],
    },
    // isAdmin && {
    //   component: CNavGroup,
    //   name: 'Loading Vehicle',
    //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    //   items: [
    //     {
    //       component: CNavItem,
    //       name: 'Create State',
    //       to: adminPath('/loading_vehicle/state'),
    //     },
    //     {
    //       component: CNavItem,
    //       name: 'Create Tax Mode',
    //       to: adminPath('/loading_vehicle/tax_mode'),
    //     },
    //     {
    //       component: CNavItem,
    //       name: 'Create Price',
    //       to: adminPath('/loading_vehicle/price'),
    //     },
    //   ],
    // },
    isAdmin && {
      component: CNavGroup,
      name: 'All India Permit',
      to: adminPath('/orders'),
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Create Price',
          to: adminPath('/all_india_permit/price'),
        },
      ],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'All India Tax',
      to: adminPath('/orders'),
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Create Price',
          to: adminPath('/all_india_tax/price'),
        },
      ],
    },
    canWithdraw && {
      component: CNavItem,
      name: 'Wallet Withdrawals',
      to: adminPath('/wallet/withdrawals'),
      icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Admin',
      icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Push Notifications',
          to: adminPath('/notifications'),
        },
        {
          component: CNavItem,
          name: 'WhatsApp Message',
          to: adminPath('/whatsapp-message'),
        },
        {
          component: CNavItem,
          name: 'Settings',
          to: adminPath('/admin'),
        },
        {
          component: CNavItem,
          name: 'Referrals',
          to: adminPath('/referrals'),
        },
      ],
    },
  ].filter(Boolean)
}

export default _nav
