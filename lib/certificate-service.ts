import { createClient } from '@/lib/supabase/client';

export interface Certificate {
  id: string;
  student_id: string;
  enrollment_id: string;
  formation_id: string;
  issue_date: string;
  certificate_url?: string;
  certificate_number: string;
  is_verified: boolean;
}

export const certificateService = {
  // Generate certificate number
  generateCertificateNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `2ION-${timestamp}-${random}`;
  },

  // Create certificate
  async createCertificate(enrollment_id: string, formation_id: string, student_id: string) {
    const supabase = createClient();
    
    const certificate: Omit<Certificate, 'id'> = {
      student_id,
      enrollment_id,
      formation_id,
      issue_date: new Date().toISOString(),
      certificate_number: this.generateCertificateNumber(),
      is_verified: true,
    };

    const { data, error } = await supabase
      .from('certificates')
      .insert([certificate])
      .select()
      .single();

    if (error) throw error;
    return data as Certificate;
  },

  // Get certificates for student
  async getStudentCertificates(studentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        formation:formations(id, name, slug)
      `)
      .eq('student_id', studentId)
      .order('issue_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get certificate details
  async getCertificateDetails(certificateId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        profile:profiles(first_name, last_name, email),
        formation:formations(id, name, description)
      `)
      .eq('id', certificateId)
      .single();

    if (error) throw error;
    return data;
  },

  // Generate certificate PDF (mock - would use jsPDF in production)
  async generatePDF(certificateData: any): Promise<Blob> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Georgia', serif; margin: 0; padding: 40px; }
          .certificate { 
            border: 8px solid #C9A227;
            padding: 60px;
            text-align: center;
            background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
          }
          .header { color: #0D2545; font-size: 48px; margin-bottom: 20px; }
          .subheader { color: #666; font-size: 24px; margin: 20px 0; }
          .name { font-size: 32px; color: #C9A227; margin: 40px 0; }
          .course { color: #0D2545; font-size: 20px; margin: 20px 0; }
          .date { color: #666; margin-top: 40px; }
          .number { color: #C9A227; font-weight: bold; margin-top: 20px; }
          .logo { width: 100px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">Certificat de Réussite</div>
          <div class="subheader">2I Online</div>
          <hr style="border: 1px solid #C9A227; width: 60%;">
          <p>Ceci certifie que</p>
          <div class="name">${certificateData.profile.first_name} ${certificateData.profile.last_name}</div>
          <p>a complété avec succès la formation</p>
          <div class="course">${certificateData.formation.name}</div>
          <p>et a démontré une maîtrise exceptionnelle des compétences requises</p>
          <div class="date">
            Émis le: ${new Date(certificateData.issue_date).toLocaleDateString('fr-FR')}
          </div>
          <div class="number">N° ${certificateData.certificate_number}</div>
        </div>
      </body>
      </html>
    `;

    return new Blob([html], { type: 'text/html' });
  },

  // Verify certificate authenticity
  async verifyCertificate(certificateNumber: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        profile:profiles(first_name, last_name),
        formation:formations(name)
      `)
      .eq('certificate_number', certificateNumber)
      .eq('is_verified', true)
      .single();

    if (error) return null;
    return data;
  },
};
