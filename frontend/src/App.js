import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import store from './store'
import './scss/style.scss'
import 'react-toastify/dist/ReactToastify.css'
<<<<<<< HEAD
<<<<<<< HEAD
// import { loadUser } from './actions/userActions'
import ProtectedRoute from './routes/protectedRoutes'
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Page404 = React.lazy(() => import('./views/page404/Page404'))

const App = () => {
  // useEffect(() => {
  //   store.dispatch(loadUser())
  // }, [])
=======
=======
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
import { loadUser } from './actions/userActions'
import ProtectedRoute from './routes/protectedRoutes'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
<<<<<<< HEAD
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
=======
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
<<<<<<< HEAD
<<<<<<< HEAD
=======
        <Route exact path="/login" name="Login Page" element={<Login />} />
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
=======
        <Route exact path="/login" name="Login Page" element={<Login />} />
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
        <Route exact path="/404" name="Page 404" element={<Page404 />} />
        <Route element={<ProtectedRoute />}>
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
