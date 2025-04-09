import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
})

axiosInstance.interceptors.request.use(async function (config) {
  let token = localStorage.getItem('token')
  token = token ? JSON.parse(token) : ''

  config.headers.Authorization = `${token}`
  if (config.isMultipart) {
    config.headers['Content-Type'] = 'multipart/form-data'
  } else {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

// local - http://localhost:4000

export default axiosInstance
