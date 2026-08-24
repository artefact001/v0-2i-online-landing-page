import Swal from 'sweetalert2'

/**
 * Wrapper SweetAlert2 réutilisable pour toutes les actions CRUD du site
 * (créer/modifier/supprimer), avec le thème sombre/doré de la plateforme.
 */

const baseConfig = {
  background: '#0d0d1a',
  color: '#ffffff',
  confirmButtonColor: '#C9A227',
  cancelButtonColor: 'rgba(255,255,255,0.15)',
}

export function alertSuccess(message: string, title = 'Succès') {
  return Swal.fire({
    ...baseConfig,
    icon: 'success',
    title,
    text: message,
    timer: 2000,
    showConfirmButton: false,
  })
}

export function alertError(message: string, title = 'Erreur') {
  return Swal.fire({
    ...baseConfig,
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'OK',
  })
}

export async function confirmDelete(itemName?: string): Promise<boolean> {
  const res = await Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title: 'Supprimer ?',
    text: itemName
      ? `"${itemName}" sera définitivement supprimé. Cette action est irréversible.`
      : 'Cette action est irréversible.',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
    reverseButtons: true,
  })
  return res.isConfirmed
}
