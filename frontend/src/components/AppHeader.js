import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
<<<<<<< HEAD
import { CContainer, CHeader, CHeaderNav, CHeaderToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import { AppHeaderDropdown } from './header/index'
// import User from '../models/userModel'
=======
import { CContainer, CHeader, CHeaderToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import { logoutUser } from '../actions/userActions'
import { showToast } from '../utils/toast'
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927

const AppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()
  const { sidebarShow } = useSelector((state) => state.sidebarShow)
<<<<<<< HEAD
  // const { user: userState } = useSelector((state) => state.user)
  // const user = new User(userState)
=======
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
<<<<<<< HEAD
        {/* <div style={{ fontSize: 16 }}>{user.getFullName()}</div> */}
        <CHeaderNav>
          <AppHeaderDropdown />
        </CHeaderNav>
=======
        <div
          onClick={() => {
            dispatch(logoutUser())
            showToast('Logout Success', 'success')
          }}
          style={{ fontSize: 16 }}
          className="text-danger"
        >
          Logout
        </div>
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
