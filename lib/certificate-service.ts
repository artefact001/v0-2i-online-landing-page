import { apiClient } from '@/lib/api/client'
import { generateCertificatePDF } from '@/lib/certificate-pdf'

export interface Certificate {
  id: string
  student_id: string
  enrollment_id: string
  formation_id: string
  issue_date: string
  certificate_url?: string
  certificate_number: string
  is_verified: boolean
}

export const certificateService = {
  generateCertificateNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 9).toUpperCase()
    return `2ION-${timestamp}-${random}`
  },

  // Crée un certificat — POST /v1/certificats
  // À VÉRIFIER: noms de champs attendus par CertificatController::store
  async createCertificate(enrollment_id: string, formation_id: string, student_id: string) {
    const res = await apiClient<Certificate>('/certificats', {
      method: 'POST',
      body: JSON.stringify({
        student_id,
        enrollment_id,
        formation_id,
        issue_date: new Date().toISOString(),
        certificate_number: this.generateCertificateNumber(),
        is_verified: true,
      }),
    })
    return res.data as Certificate
  },

  // Liste des certificats de l'étudiant connecté — GET /v1/certificats
  // À VÉRIFIER: le backend filtre-t-il automatiquement par l'utilisateur connecté,
  // ou faut-il passer ?student_id=... en query param ?
  async getStudentCertificates(studentId: string) {
    const res = await apiClient(`/certificats?student_id=${studentId}`)
    return res.data
  },

  // Détails d'un certificat — GET /v1/certificats/{id}
  async getCertificateDetails(certificateId: string) {
    const res = await apiClient(`/certificats/${certificateId}`)
    return res.data
  },

  // Téléchargement — GET /v1/certificats/{id}/download
  // Cette route existe côté Laravel et renvoie probablement directement un fichier
  // (PDF), pas du JSON. À adapter selon le Content-Type réel renvoyé.
  getDownloadUrl(certificateId: string) {
    return `/api/backend/certificats/${certificateId}/download`
  },

  // Vérification d'authenticité par numéro de certificat.
  // AUCUNE route publique de vérification par numéro n'existe dans routes/api.php.
  // Il faudrait soit filtrer côté frontend via GET /v1/certificats?certificate_number=...,
  // soit demander l'ajout d'un endpoint public dédié côté Laravel (utile pour un QR code
  // de vérification accessible sans connexion).
  async verifyCertificate(certificateNumber: string) {
    try {
      const res = await apiClient(`/certificats?certificate_number=${certificateNumber}`)
      const list = Array.isArray(res.data) ? res.data : []
      return list[0] ?? null
    } catch {
      return null
    }
  },

  // Génération PDF 100% côté client (lib/certificate-pdf.ts, indépendant du backend)
  async generatePDF(certificate: any): Promise<Blob> {
    const doc = generateCertificatePDF({
      studentName: certificate.student_name ?? certificate.studentName ?? '',
      title: certificate.formation_name ?? certificate.title ?? '',
      score: certificate.score ?? 0,
      maxScore: certificate.max_score ?? certificate.maxScore ?? 100,
      percentage: certificate.percentage ?? 100,
      certificateNumber: certificate.certificate_number ?? certificate.certificateNumber ?? '',
      date: certificate.issue_date ? new Date(certificate.issue_date) : new Date(),
    })
    return doc.output('blob')
  },
}
