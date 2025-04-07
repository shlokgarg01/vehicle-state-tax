import { toast } from 'react-toastify'

export const showToast = (message, type = 'success') => {
  toast[type](message, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  })
}
