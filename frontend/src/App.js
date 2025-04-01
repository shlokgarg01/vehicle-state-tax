import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import store from './store'
import './scss/style.scss'
import 'react-toastify/dist/ReactToastify.css'
// import { loadUser } from './actions/userActions'
import ProtectedRoute from './routes/protectedRoutes'
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Page404 = React.lazy(() => import('./views/page404/Page404'))

const App = () => {
  // useEffect(() => {
  //   store.dispatch(loadUser())
  // }, [])

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route exact path="/404" name="Page 404" element={<Page404 />} />
        <Route element={<ProtectedRoute />}>
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
