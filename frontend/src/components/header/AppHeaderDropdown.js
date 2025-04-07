import React from 'react'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout } from '@coreui/icons'
import { showToast } from '../../utils/toast'
import { useDispatch, useSelector } from 'react-redux'
// import { logoutUser } from '../../actions/userActions'
// import User from '../../models/userModel'
import Colors from '../../utils/colors'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  // const { user: userData } = useSelector((state) => state.user)
  // const user = new User(userData)

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <div
          style={{
            backgroundColor: Colors.LIGHT_GRAY,
            padding: 7,
            fontSize: 14,
            color: Colors.BLACK,
            borderRadius: 100,
          }}
        >
          {/* {user.getUserAvatar()} */}
        </div>
      </CDropdownToggle>

      <CDropdownMenu className="py-0" placement="bottom-end">
        <CDropdownItem
          className="text-danger"
          onClick={() => {
            // dispatch(logoutUser())
            showToast('Logout Success', 'success')
          }}
        >
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
