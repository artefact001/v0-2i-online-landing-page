import { apiClient } from '@/lib/api/client'
import { generateCertificatePDF } from '@/lib/certificate-pdf'

/**
 * Schéma Laravel réel (table certificats) :
 * id, numero_certificat, fichier_pdf, date_obtention, user_id, formation_id.
 * Pas de enrollment_id, pas de is_verified, pas de certificate_url séparé.
 */
export interface Certificate {
  id: string
  user_id: string
  formation_id: string
  numero_certificat: string
  fichier_pdf: string
  date_obtention: string
}

export const certificateService = {
  generateCertificateNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 9).toUpperCase()
    return `2ION-${timestamp}-${random}`
  },

  // Crée un certificat — POST /v1/certificats
  // ATTENTION: 'fichier_pdf' est un champ NOT NULL côté Laravel (pas de
  // endpoint de génération/upload PDF connu). En attendant de clarifier ce
  // flux avec le backend, on envoie l'URL de la route de téléchargement
  // elle-même comme valeur temporaire — à ajuster si Laravel attend un
  // vrai chemin de fichier déjà stocké.
  async createCertificate(formationId: string, userId: string) {
    const numero = this.generateCertificateNumber()
    const res = await apiClient<Certificate>('/certificats', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        formation_id: formationId,
        numero_certificat: numero,
        fichier_pdf: `/certificats/${numero}.pdf`,
        date_obtention: new Date().toISOString().slice(0, 10),
      }),
    })
    return res.data as Certificate
  },

  // Liste des certificats de l'utilisateur connecté — GET /v1/certificats
  async getStudentCertificates(userId: string) {
    const res = await apiClient(`/certificats?user_id=${userId}`)
    return res.data
  },

  // Détails d'un certificat — GET /v1/certificats/{id}
  async getCertificateDetails(certificateId: string) {
    const res = await apiClient(`/certificats/${certificateId}`)
    return res.data
  },

  // Téléchargement — GET /v1/certificats/{id}/download
  getDownloadUrl(certificateId: string) {
    return `/api/backend/certificats/${certificateId}/download`
  },

  // Vérification d'authenticité par numéro de certificat.
  // AUCUNE route publique de vérification par numéro n'existe dans
  // routes/api.php — filtrage via GET /v1/certificats?numero_certificat=...
  async verifyCertificate(numeroCertificat: string) {
    try {
      const res = await apiClient(`/certificats?numero_certificat=${numeroCertificat}`)
      const list = Array.isArray(res.data) ? res.data : []
      return list[0] ?? null
    } catch {
      return null
    }
  },

  // Génération PDF 100% côté client (lib/certificate-pdf.ts, indépendant
  // du backend) — utilisée pour l'affichage/téléchargement immédiat, quel
  // que soit ce que fichier_pdf contient réellement côté serveur.
  async generatePDF(certificate: any, extra?: { studentName?: string; formationName?: string }): Promise<Blob> {
    const doc = generateCertificatePDF({
      studentName: extra?.studentName ?? '',
      title: extra?.formationName ?? '',
      score: 0,
      maxScore: 100,
      percentage: 100,
      certificateNumber: certificate.numero_certificat ?? '',
      date: certificate.date_obtention ? new Date(certificate.date_obtention) : new Date(),
    })
    return doc.output('blob')
  },
}
