/**
 * Email Service for 2I Online
 * 
 * This service handles sending emails for various events:
 * - Enrollment confirmations
 * - Payment confirmations
 * - Course reminders
 * - Session notifications
 * 
 * In production, integrate with services like:
 * - SendGrid
 * - Mailgun
 * - AWS SES
 * - Resend
 */

import { createClient } from '@/lib/supabase/client'

export interface EmailTemplate {
  subject: string
  htmlContent: string
  textContent: string
}

export class EmailService {
  private supabase = createClient()

  /**
   * Send enrollment confirmation email
   */
  async sendEnrollmentConfirmation(
    email: string,
    studentName: string,
    formationName: string
  ): Promise<boolean> {
    try {
      const template = this.getEnrollmentTemplate(studentName, formationName)
      return await this.sendEmail(email, template)
    } catch (error) {
      console.error('Error sending enrollment confirmation:', error)
      return false
    }
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmation(
    email: string,
    studentName: string,
    formationName: string,
    amount: number,
    transactionId: string
  ): Promise<boolean> {
    try {
      const template = this.getPaymentTemplate(
        studentName,
        formationName,
        amount,
        transactionId
      )
      return await this.sendEmail(email, template)
    } catch (error) {
      console.error('Error sending payment confirmation:', error)
      return false
    }
  }

  /**
   * Send live session reminder
   */
  async sendSessionReminder(
    email: string,
    studentName: string,
    sessionTitle: string,
    sessionTime: Date
  ): Promise<boolean> {
    try {
      const template = this.getSessionReminderTemplate(
        studentName,
        sessionTitle,
        sessionTime
      )
      return await this.sendEmail(email, template)
    } catch (error) {
      console.error('Error sending session reminder:', error)
      return false
    }
  }

  /**
   * Send new content notification
   */
  async sendNewContentNotification(
    email: string,
    studentName: string,
    contentTitle: string,
    formationName: string
  ): Promise<boolean> {
    try {
      const template = this.getNewContentTemplate(
        studentName,
        contentTitle,
        formationName
      )
      return await this.sendEmail(email, template)
    } catch (error) {
      console.error('Error sending new content notification:', error)
      return false
    }
  }

  /**
   * Send completion certificate
   */
  async sendCompletionCertificate(
    email: string,
    studentName: string,
    formationName: string,
    completionDate: Date
  ): Promise<boolean> {
    try {
      const template = this.getCompletionTemplate(
        studentName,
        formationName,
        completionDate
      )
      return await this.sendEmail(email, template)
    } catch (error) {
      console.error('Error sending completion certificate:', error)
      return false
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(
    email: string,
    studentName: string,
    resetLink: string
  ): Promise<boolean> {
    try {
      const template = this.getPasswordResetTemplate(studentName, resetLink)
      return await this.sendEmail(email, template)
    } catch (error) {
      console.error('Error sending password reset:', error)
      return false
    }
  }

  /**
   * Generic send email function
   * In production, replace with actual email provider
   */
  private async sendEmail(
    email: string,
    template: EmailTemplate
  ): Promise<boolean> {
    try {
      // TODO: Integrate with email provider (SendGrid, Mailgun, etc.)
      // For now, we'll just log the email
      console.log('📧 Email sent:', {
        to: email,
        subject: template.subject,
        timestamp: new Date().toISOString(),
      })

      // In production:
      // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     personalizations: [{ to: [{ email }] }],
      //     from: { email: 'noreply@2ionline.com' },
      //     subject: template.subject,
      //     content: [{ type: 'text/html', value: template.htmlContent }],
      //   }),
      // })
      // return response.ok

      return true
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }

  // Template generators
  private getEnrollmentTemplate(
    studentName: string,
    formationName: string
  ): EmailTemplate {
    return {
      subject: `Bienvenue à ${formationName} - 2I Online`,
      htmlContent: `
        <h2>Bienvenue ${studentName}! 👋</h2>
        <p>Votre inscription à <strong>${formationName}</strong> a été confirmée.</p>
        <p>Vous pouvez maintenant accéder à tous les contenus de la formation.</p>
        <a href="https://2ionline.com/dashboard/student" style="background-color: #C9A227; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Accéder aux cours
        </a>
      `,
      textContent: `Bienvenue ${studentName}! Votre inscription à ${formationName} a été confirmée. Visitez https://2ionline.com/dashboard/student pour commencer.`,
    }
  }

  private getPaymentTemplate(
    studentName: string,
    formationName: string,
    amount: number,
    transactionId: string
  ): EmailTemplate {
    return {
      subject: `Paiement confirmé - ${formationName}`,
      htmlContent: `
        <h2>Paiement reçu ✓</h2>
        <p>Merci ${studentName} pour votre paiement!</p>
        <p><strong>Montant:</strong> ${amount.toLocaleString()} FCFA</p>
        <p><strong>Formation:</strong> ${formationName}</p>
        <p><strong>Référence:</strong> ${transactionId}</p>
        <p>Vous pouvez maintenant accéder à tous les cours.</p>
      `,
      textContent: `Paiement reçu. Montant: ${amount} FCFA. Formation: ${formationName}. Référence: ${transactionId}.`,
    }
  }

  private getSessionReminderTemplate(
    studentName: string,
    sessionTitle: string,
    sessionTime: Date
  ): EmailTemplate {
    const formattedTime = sessionTime.toLocaleString('fr-FR')
    return {
      subject: `Rappel: ${sessionTitle} - Demain à ${sessionTime.toLocaleTimeString('fr-FR')}`,
      htmlContent: `
        <h2>Rappel de cours en direct 🔔</h2>
        <p>Bonjour ${studentName},</p>
        <p>Vous avez un cours en direct demain!</p>
        <p><strong>Titre:</strong> ${sessionTitle}</p>
        <p><strong>Heure:</strong> ${formattedTime}</p>
        <a href="https://2ionline.com/dashboard/student" style="background-color: #C9A227; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Rejoindre le cours
        </a>
      `,
      textContent: `Rappel: ${sessionTitle} demain à ${formattedTime}. Visitez https://2ionline.com/dashboard/student pour rejoindre.`,
    }
  }

  private getNewContentTemplate(
    studentName: string,
    contentTitle: string,
    formationName: string
  ): EmailTemplate {
    return {
      subject: `Nouveau contenu dans ${formationName}`,
      htmlContent: `
        <h2>Nouveau contenu disponible 🎓</h2>
        <p>Bonjour ${studentName},</p>
        <p>Un nouveau contenu a été ajouté à votre formation!</p>
        <p><strong>Titre:</strong> ${contentTitle}</p>
        <p><strong>Formation:</strong> ${formationName}</p>
        <a href="https://2ionline.com/dashboard/student" style="background-color: #C9A227; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Accéder au cours
        </a>
      `,
      textContent: `Nouveau contenu: ${contentTitle} dans ${formationName}. Visitez https://2ionline.com/dashboard/student.`,
    }
  }

  private getCompletionTemplate(
    studentName: string,
    formationName: string,
    completionDate: Date
  ): EmailTemplate {
    const formattedDate = completionDate.toLocaleDateString('fr-FR')
    return {
      subject: `Certificat - ${formationName}`,
      htmlContent: `
        <h2>Félicitations! 🎉</h2>
        <p>Bravo ${studentName},</p>
        <p>Vous avez complété avec succès la formation <strong>${formationName}</strong>!</p>
        <p><strong>Date de complétion:</strong> ${formattedDate}</p>
        <p>Votre certificat est maintenant disponible dans votre profil.</p>
        <a href="https://2ionline.com/dashboard/student" style="background-color: #C9A227; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Télécharger le certificat
        </a>
      `,
      textContent: `Félicitations! Vous avez complété ${formationName} le ${formattedDate}. Téléchargez votre certificat sur https://2ionline.com/dashboard/student.`,
    }
  }

  private getPasswordResetTemplate(
    studentName: string,
    resetLink: string
  ): EmailTemplate {
    return {
      subject: 'Réinitialiser votre mot de passe - 2I Online',
      htmlContent: `
        <p>Bonjour ${studentName},</p>
        <p>Vous avez demandé une réinitialisation de mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:</p>
        <a href="${resetLink}" style="background-color: #C9A227; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Réinitialiser le mot de passe
        </a>
        <p>Ce lien expire dans 24 heures.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignnorez cet email.</p>
      `,
      textContent: `Réinitialiser votre mot de passe: ${resetLink}. Ce lien expire dans 24 heures.`,
    }
  }
}

export const emailService = new EmailService()
