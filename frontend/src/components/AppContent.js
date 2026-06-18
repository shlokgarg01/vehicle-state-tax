import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import Constants from '../utils/constants'

const AppContent = () => {
  const { user } = useSelector((state) => state.user)

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            const isAdminOnly = route.adminOnly && user?.role !== Constants.ROLES.ADMIN

            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={
                    isAdminOnly ? (
                      <Navigate
                        to={user?.role === Constants.ROLES.MANAGER ? '/orders/new' : '/'}
                        replace
                      />
                    ) : (
                      <route.element />
                    )
                  }
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
