import { redirect } from 'next/navigation'

// Doublon de app/dashboard/admin/users (page réelle, connectée à Laravel).
// Redirection conservée au cas où quelqu'un a cette URL en favori.
export default function AdminStudentsRedirect() {
  redirect('/dashboard/admin/users')
}
