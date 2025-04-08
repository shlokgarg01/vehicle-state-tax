import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, loginUser } from '../../../actions/userActions'
import Loader from '../../../components/Loader/Loader'
import { showToast } from '../../../utils/toast'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { error, loading, isAuthenticated } = useSelector((state) => state.user)

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(username, password))
  }

  useEffect(() => {
    if (isAuthenticated) {
      showToast('Login Successful')
      navigate('/')
    }

    if (error) {
      showToast(error, 'error')
      dispatch(clearErrors())
    }
  }, [dispatch, error, isAuthenticated, navigate])

  return loading ? (
    <Loader />
  ) : (
    <div className="login-container d-flex align-items-center justify-content-center ">
      <div className="row login-form-container text-dark">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src="/logo-banner.avif"
            alt="Login"
            className="img-fluid rounded"
            style={{ maxHeight: '250px', objectFit: 'contain' }}
          />
        </div>

        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div>
            <h2 className="text-center mb-4">Safar Manager</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control custom-input"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
