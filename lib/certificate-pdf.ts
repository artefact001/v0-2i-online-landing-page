import { jsPDF } from 'jspdf'

export interface CertificateData {
  studentName: string
  title: string // formation / exam title
  score: number
  maxScore: number
  percentage: number
  certificateNumber: string
  date?: Date
}

// Brand palette
const GOLD: [number, number, number] = [201, 162, 39] // #C9A227
const NAVY: [number, number, number] = [13, 27, 42] // #0D1B2A
const NAVY_DARK: [number, number, number] = [10, 15, 26] // #0a0f1a
const LIGHT: [number, number, number] = [245, 245, 245]

/**
 * Generate a branded 2I Online certificate as a downloadable PDF (A4 landscape).
 */
export function generateCertificatePDF(data: CertificateData): jsPDF {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const w = doc.internal.pageSize.getWidth()
  const h = doc.internal.pageSize.getHeight()
  const date = data.date ?? new Date()

  // Background
  doc.setFillColor(...NAVY_DARK)
  doc.rect(0, 0, w, h, 'F')

  // Inner panel
  doc.setFillColor(...NAVY)
  doc.roundedRect(10, 10, w - 20, h - 20, 3, 3, 'F')

  // Gold border frame
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(1.2)
  doc.roundedRect(14, 14, w - 28, h - 28, 2, 2, 'S')
  doc.setLineWidth(0.3)
  doc.roundedRect(17, 17, w - 34, h - 34, 2, 2, 'S')

  // Logo: "2I Online"
  doc.setFont('times', 'bold')
  doc.setFontSize(34)
  doc.setTextColor(...GOLD)
  doc.text('2', w / 2 - 26, 40, { align: 'left' })
  doc.setTextColor(255, 255, 255)
  doc.text('I', w / 2 - 16, 40, { align: 'left' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.text('ONLINE', w / 2 - 6, 38, { align: 'left' })
  doc.setFontSize(7)
  doc.setTextColor(170, 170, 170)
  doc.text('by Incub Institut', w / 2 - 6, 43, { align: 'left' })

  // Title
  doc.setFont('times', 'bold')
  doc.setFontSize(30)
  doc.setTextColor(...GOLD)
  doc.text('CERTIFICAT DE REUSSITE', w / 2, 62, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(200, 200, 200)
  doc.text('Ce certificat est decerne a', w / 2, 76, { align: 'center' })

  // Student name
  doc.setFont('times', 'bolditalic')
  doc.setFontSize(26)
  doc.setTextColor(255, 255, 255)
  doc.text(data.studentName, w / 2, 92, { align: 'center' })

  // Underline under name
  const nameWidth = Math.min(140, doc.getTextWidth(data.studentName) + 20)
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.5)
  doc.line(w / 2 - nameWidth / 2, 96, w / 2 + nameWidth / 2, 96)

  // Body
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(200, 200, 200)
  doc.text('pour avoir reussi avec succes l\'evaluation', w / 2, 108, { align: 'center' })

  doc.setFont('times', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...GOLD)
  doc.text(data.title, w / 2, 119, { align: 'center', maxWidth: w - 80 })

  // Score
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(255, 255, 255)
  doc.text(
    `Note obtenue : ${data.score}/${data.maxScore} points  (${data.percentage}%)`,
    w / 2,
    132,
    { align: 'center' },
  )

  // Footer: date + certificate number
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(180, 180, 180)
  doc.text(
    `Delivre le ${date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}`,
    32,
    h - 26,
  )
  doc.setTextColor(...GOLD)
  doc.setFont('helvetica', 'bold')
  doc.text(`N° ${data.certificateNumber}`, w - 32, h - 26, { align: 'right' })

  // Signature line
  doc.setDrawColor(180, 180, 180)
  doc.setLineWidth(0.3)
  doc.line(w / 2 - 30, h - 30, w / 2 + 30, h - 30)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(180, 180, 180)
  doc.text('Direction 2I Online', w / 2, h - 25, { align: 'center' })

  return doc
}

export function downloadCertificate(data: CertificateData) {
  const doc = generateCertificatePDF(data)
  doc.save(`certificat-2ionline-${data.certificateNumber}.pdf`)
}

export function generateCertificateNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `2ION-${timestamp}-${random}`
}
