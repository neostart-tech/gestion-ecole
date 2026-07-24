import Swal from 'sweetalert2'

export default defineNuxtPlugin(() => {
  // Configuration de base
  const defaultOptions = {
    confirmButtonColor: '#4f46e5', // indigo-600
    cancelButtonColor: '#6b7280', // gray-500
    buttonsStyling: true,
    reverseButtons: true,
    showClass: {
      popup: 'swal2-show',
      backdrop: 'swal2-backdrop-show',
      icon: 'swal2-icon-show'
    },
    hideClass: {
      popup: 'swal2-hide',
      backdrop: 'swal2-backdrop-hide',
      icon: 'swal2-icon-hide'
    }
  }

  // Appliquer les options par défaut
  Swal.mixin(defaultOptions)

  // Fonction pour appliquer le thème
  const applyTheme = () => {
    const isDark = document.documentElement.classList.contains('dark')
    
    if (isDark) {
      // Mode sombre
      Swal.mixin({
        background: '#1f2937',
        color: '#fff',
        iconColor: '#fff',
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#6b7280',
        backdrop: `
          rgba(0,0,0,0.8)
        `
      })
    } else {

      Swal.mixin({
        background: '#fff',
        color: '#000',
        iconColor: '#000',
        confirmButtonColor: '#4f46e5', 
        cancelButtonColor: '#6b7280',
        backdrop: `
          rgba(0,0,0,0.4)
        `
      })
    }
  }

  if (process.client) {
    applyTheme()
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          applyTheme()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  }

  return {
    provide: {
      swal: Swal
    }
  }
})