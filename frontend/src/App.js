import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { store } from './store'
import './scss/style.scss'
import 'react-toastify/dist/ReactToastify.css'
import { loadUser } from './actions/userActions'
import ProtectedRoute from './routes/protectedRoutes'
import { useDispatch } from 'react-redux'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    store.dispatch(loadUser())
  }, [dispatch])

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route exact path="/login" name="Login Page" element={<Login />} />
        <Route exact path="/404" name="Page 404" element={<Page404 />} />
        <Route element={<ProtectedRoute />}>
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
