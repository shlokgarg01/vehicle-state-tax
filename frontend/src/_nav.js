import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilDrop, cilPuzzle, cilSpeedometer, cilCalculator } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
import Constants from './utils/constants'

const _nav = (role) => {
  const isAdmin = role === Constants.ROLES.ADMIN

  return [
    {
      component: CNavItem,
      name: 'Home',
      to: '/',
      icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: 'Orders',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'New Orders',
          to: '/orders/new',
        },
        {
          component: CNavItem,
          name: 'Completed Orders',
          to: '/orders/completed',
        },
        {
          component: CNavItem,
          name: 'Search Orders',
          to: '/orders/search',
        },
      ],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Users',
      to: '/users',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: [{ component: CNavItem, name: 'All users', to: '/user' }],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Employees',

      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      items: [{ component: CNavItem, name: 'All employee', to: '/employee' }],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Banners',

      icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
      items: [{ component: CNavItem, name: 'All banner', to: '/banners/list' }],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Border Tax',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Create State',
          to: '/border_tax/state',
        },
        {
          component: CNavItem,
          name: 'Create Tax Mode',
          to: '/border_tax/tax_mode',
        },
        {
          component: CNavItem,
          name: 'Create Price',
          to: '/border_tax/price',
        },
      ],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Road Tax',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Create State',
          to: '/road_tax/state',
        },
        {
          component: CNavItem,
          name: 'Create Tax Mode',
          to: '/road_tax/tax_mode',
        },
        {
          component: CNavItem,
          name: 'Create Price',
          to: '/road_tax/price',
        },
      ],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'Loading Vehicle',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Create State',
          to: '/loading_vehicle/state',
        },
        {
          component: CNavItem,
          name: 'Create Tax Mode',
          to: '/loading_vehicle/tax_mode',
        },
        {
          component: CNavItem,
          name: 'Create Price',
          to: '/loading_vehicle/price',
        },
      ],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'All India Permit',
      to: '/orders',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Create Price',
          to: '/all_india_permit/price',
        },
      ],
    },
    isAdmin && {
      component: CNavGroup,
      name: 'All India Tax',
      to: '/orders',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Create Price',
          to: '/all_india_tax/price',
        },
      ],
    },
  ].filter(Boolean)
}

export default _nav
