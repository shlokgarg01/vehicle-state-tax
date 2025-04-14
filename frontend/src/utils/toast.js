import { toast } from 'react-toastify'

export const showToast = (message, type = 'success', timer = 2000) => {
  toast[type](message, {
    position: 'top-right',
    autoClose: timer,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  })
}
