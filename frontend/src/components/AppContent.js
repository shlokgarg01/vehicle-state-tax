import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import Constants from '../utils/constants'

const AppContent = () => {
  const { user, loading } = useSelector((state) => state.user)

  if (loading && !user?.role) {
    return (
      <CContainer className="px-4 d-flex justify-content-center py-5" lg>
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            const isAdminOnly = route.adminOnly && user?.role !== Constants.ROLES.ADMIN
            const lacksWithdrawAccess =
              route.withdrawAccess &&
              user?.role !== Constants.ROLES.ADMIN &&
              !user?.canWithdraw
            const isRestricted = isAdminOnly || lacksWithdrawAccess

            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={
                    isRestricted ? (
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
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
