import React from 'react'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../actions/userActions'
import { showToast } from '../../utils/toast'
import Colors from '../../utils/colors'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user || {}) || {}

  const handleLogout = () => {
    dispatch(logoutUser())
    showToast('Logout Success', 'success')
  }

  return (
    <CDropdown
      variant="nav-item"
      style={{
        listStyle: 'none',
        textDecoration: 'none',
      }}
    >
      <CDropdownToggle placement="bottom-center" className="py-0 pe-0" caret={false}>
        {user?.image ? (
          <img
            src={user.image}
            alt="avatar"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              backgroundColor: Colors.LIGHT_GRAY,
              padding: '8px 12px',
              fontSize: 14,
              color: Colors.BLACK,
              borderRadius: '100%',
              fontWeight: 'bold',
              minWidth: 36,
              textAlign: 'center',
            }}
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </CDropdownToggle>

      <CDropdownMenu className="py-0" placement="bottom-end">
        {user?.username ||
          (user?.name && (
            <CDropdownItem disabled style={{ fontWeight: 500 }}>
              {user.name}
            </CDropdownItem>
          ))}
        {user?.email && (
          <CDropdownItem disabled style={{ fontSize: 12, opacity: 0.8 }}>
            {user.email}
          </CDropdownItem>
        )}
        <CDropdownItem className="text-danger" onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
