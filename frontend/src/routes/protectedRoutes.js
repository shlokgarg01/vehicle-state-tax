/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

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

  return <Outlet />
}

export default ProtectedRoute
