import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer } from '@coreui/icons'
import { CNavGroup } from '@coreui/react'
import Enums from './utils/enums'

const _nav = (role) => {
  const isAdmin = role === Enums.ROLES.ADMIN
  const isSuperAdmin = role === Enums.ROLES.SUPER_ADMIN

  return [
    // isSuperAdmin && {
    //   component: CNavGroup,
    //   name: 'Admin',
    //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    //   items: [
    //     {
    //       component: CNavItem,
    //       name: 'Users',
    //       to: '/dashboard/admin/user/all',
    //     },
    //     {
    //       component: CNavItem,
    //       name: 'States',
    //       to: '/dashboard/admin/state',
    //     },
    //     {
    //       component: CNavItem,
    //       name: 'Super Login',
    //       to: '/dashboard/admin/super_login',
    //     },
    //   ],
    // },
    {
      component: CNavGroup,
      name: 'Masters',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      items: [
        // {
        //   component: CNavItem,
        //   name: 'City Master',
        //   to: '/dashboard/admin/city',
        // },
      ],
    },
  ].filter(Boolean) // This removes the false values from the array
}

export default _nav
