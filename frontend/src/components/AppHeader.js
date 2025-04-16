import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CContainer, CHeader, CHeaderToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import { logoutUser } from '../actions/userActions'
import { showToast } from '../utils/toast'
import { AppHeaderDropdown } from './header'
import { removeUnderScoreAndCapitalize } from '../helpers/strings'

const AppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()
  const { sidebarShow } = useSelector((state) => state.sidebarShow)
  const { user } = useSelector((state) => state.user)
  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-2 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <div className="fw-bold fs-5">{removeUnderScoreAndCapitalize(user?.name)}</div>
        <AppHeaderDropdown />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
