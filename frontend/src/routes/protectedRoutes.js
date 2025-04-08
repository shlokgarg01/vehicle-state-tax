/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

<<<<<<< HEAD
<<<<<<< HEAD
const ProtectedRoute = ({ isAdmin, isSuperAdmin }) => {
  const navigate = useNavigate()
  // const { isAuthenticated, user, loading } = useSelector((state) => state.user)

  // useEffect(() => {
    // if (!isAuthenticated || (loading === false && isAuthenticated === false)) {
    //   navigate('/login')
    // }

    // if (user && isAdmin && user.role === 'user') {
    //   navigate('/login')
    // }
  // }, [isAuthenticated, isAdmin, navigate, user])
=======
=======
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
const ProtectedRoute = ({ isAdmin }) => {
  const navigate = useNavigate()
  const { isAuthenticated, user, loading } = useSelector((state) => state.user)

  useEffect(() => {
    if (!isAuthenticated || (loading === false && isAuthenticated === false)) {
      navigate('/login')
    }

    if (user && isAdmin && user.role === 'user') {
      navigate('/login')
    }
  }, [isAdmin, navigate])
<<<<<<< HEAD
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
=======
>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927

  return <Outlet />
}

export default ProtectedRoute
