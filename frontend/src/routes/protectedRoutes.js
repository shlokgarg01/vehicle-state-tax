import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ isAdmin }) => {
  const navigate = useNavigate()
  const { isAuthenticated, user, loading } = useSelector((state) => state.user)

  useEffect(() => {
    if (loading) return // Prevent redirect until authentication status is determined

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // If the user is authenticated but needs to be an admin
    if (isAdmin && user?.role !== 'admin') {
      navigate('/login') // Or you can redirect to another page like '/not-authorized'
    }
  }, [isAdmin, isAuthenticated, user, loading, navigate]) // Add all relevant dependencies

  return <Outlet /> // Only render child routes if the conditions are met
}

export default ProtectedRoute
