import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

export default defineNuxtPlugin(() => {
  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    timeOut: 3000,
    newestOnTop: true,
  }

  return {
    provide: {
      toastr
    }
  }
})
