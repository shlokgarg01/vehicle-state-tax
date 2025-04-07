import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CCloseButton, CSidebar, CSidebarHeader } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
// import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const { sidebarShow } = useSelector((state) => state.sidebarShow)
  // const { user } = useSelector((state) => state.user)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <div className="d-flex align-items-center">
          <div className="me-2 bg-light rounded-circle">
            {/* <img
              src="/updated-logo.png"
              className="img-fluid"
              style={{ height: '90px', width: '100px' }}
              alt="Company Logo"
            /> */}
          </div>
          <p className="mb-0">Vehicle State Tax</p>
        </div>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav />
      {/* <AppSidebarNav items={navigation(user?.role)} /> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
