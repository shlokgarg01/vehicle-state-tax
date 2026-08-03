import React, { useEffect, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { ToastContainer } from 'react-toastify'
import { store } from './store'
import { loadUser } from './actions/userActions'
import ProtectedRoute from './routes/protectedRoutes'

const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const AdminApp = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <>
      <ToastContainer />
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="404" element={<Page404 />} />
          <Route element={<ProtectedRoute />}>
            <Route path="*" element={<DefaultLayout />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default AdminApp
