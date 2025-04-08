import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
})

axiosInstance.interceptors.request.use(async function (config) {
  let token = localStorage.getItem('token')
  token = token ? JSON.parse(token) : ''

  config.headers.Authorization = `${token}`
  config.headers['Content-Type'] = 'application/json'
  return config
})

<<<<<<< HEAD
=======
// local - http://localhost:4000

>>>>>>> f4d1f8adfe88f8999e130f43d0e79fd885fc3927
export default axiosInstance
