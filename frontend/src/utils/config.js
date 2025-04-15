import axios from 'axios'

const axiosInstance = axios.create({
  // baseURL: 'http://194.164.149.195:4000', // Your API base URL
  baseURL: 'http://localhost:4000', // Your API base URL
})

axiosInstance.interceptors.request.use(
  async function (config) {
    let token = localStorage.getItem('token')
    token = token ? token : ''

    // Add the token to the Authorization header with 'Bearer' prefix
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Check if the request is multipart, then set the appropriate Content-Type
    if (config.isMultipart) {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  function (error) {
    // Handle request error
    return Promise.reject(error)
  },
)

export default axiosInstance

// prod - http://194.164.149.195:4000
// local - http://localhost:4000
