import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CCloseButton, CSidebar, CSidebarHeader } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
<<<<<<< HEAD
<<<<<<< HEAD
// import navigation from '../_nav'
=======
import navigation from '../_nav'
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
=======
import navigation from '../_nav'
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const { sidebarShow } = useSelector((state) => state.sidebarShow)
<<<<<<< HEAD
<<<<<<< HEAD
  // const { user } = useSelector((state) => state.user)
=======
  const { user } = useSelector((state) => state.user)
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
=======
  const { user } = useSelector((state) => state.user)
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927

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
<<<<<<< HEAD
<<<<<<< HEAD
      <AppSidebarNav />
      {/* <AppSidebarNav items={navigation(user?.role)} /> */}
=======
      <AppSidebarNav items={navigation(user?.role)} />
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
=======
      <AppSidebarNav items={navigation(user?.role)} />
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
