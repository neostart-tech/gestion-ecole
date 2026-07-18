import config from '~~/config'

// Source unique de vérité pour construire des URLs absolues (fichiers stockés,
// appels API bruts) selon l'environnement (config.app_local), au lieu de chaque
// page qui devinait cette URL elle-même (souvent codée en dur sur localhost:8000,
// ce qui cassait la résolution des fichiers une fois déployé).
export function getStorageBaseUrl() {
  return config.app_local ? config.app_dev_storage_url : config.app_prod_storage_url
}

export function getApiBaseUrl() {
  return config.app_local ? config.app_dev_url : config.app_prod_url
}
