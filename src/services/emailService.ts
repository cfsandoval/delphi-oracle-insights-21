import { supabase } from '@/integrations/supabase/client';
import { SecurityUtils } from '@/lib/security';

export interface InvitationEmailData {
  expertName: string;
  expertEmail: string;
  studyTitle?: string;
  inviterName?: string;
  customMessage?: string;
}

export class EmailService {
  async sendExpertInvitation(data: InvitationEmailData): Promise<boolean> {
    try {
      // Validate and sanitize input data
      if (!SecurityUtils.isValidEmail(data.expertEmail)) {
        throw new Error('Invalid email address');
      }

      // Check rate limiting
      if (SecurityUtils.isRateLimited(data.expertEmail, 3, 300000)) { // 3 emails per 5 minutes
        throw new Error('Rate limit exceeded for this email address');
      }

      const sanitizedData = this.sanitizeEmailData(data);
      const emailHtml = this.generateInvitationHTML(sanitizedData);
      
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: sanitizedData.expertEmail,
          subject: sanitizedData.studyTitle 
            ? `Invitación para participar en el estudio: ${sanitizedData.studyTitle}`
            : 'Invitación para participar en estudios Delphi',
          html: emailHtml,
          from: 'Plataforma Delphi <noreply@delphi.com>'
        }
      });

      if (error) {
        console.error('Error sending invitation email:', error);
        throw error;
      }

      console.log('Invitation email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      throw error;
    }
  }

  async sendBulkInvitations(invitations: InvitationEmailData[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const invitation of invitations) {
      try {
        await this.sendExpertInvitation(invitation);
        success++;
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to send invitation to ${invitation.expertEmail}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }

  private sanitizeEmailData(data: InvitationEmailData): InvitationEmailData {
    return {
      expertName: SecurityUtils.validateAndSanitizeText(data.expertName, 100),
      expertEmail: data.expertEmail.toLowerCase().trim(),
      studyTitle: data.studyTitle ? SecurityUtils.validateAndSanitizeText(data.studyTitle, 200) : undefined,
      inviterName: data.inviterName ? SecurityUtils.validateAndSanitizeText(data.inviterName, 100) : undefined,
      customMessage: data.customMessage ? SecurityUtils.validateAndSanitizeText(data.customMessage, 500) : undefined,
    };
  }

  private generateInvitationHTML(data: InvitationEmailData): string {
    const { expertName, studyTitle, inviterName, customMessage } = data;
    
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitación a Estudio Delphi</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .title {
            color: #1e40af;
            font-size: 28px;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .study-info {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2563eb;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🔬 Plataforma Delphi</div>
            <h1 class="title">Invitación a Participar</h1>
          </div>
          
          <div class="content">
            <p>Estimado/a <strong>${expertName}</strong>,</p>
            
            <p>Nos complace invitarle a participar en ${studyTitle ? `nuestro estudio: <strong>${studyTitle}</strong>` : 'nuestros estudios utilizando la metodología Delphi'}.</p>
            
            ${studyTitle ? `
              <div class="study-info">
                <h3>📋 Información del Estudio</h3>
                <p><strong>Título:</strong> ${studyTitle}</p>
                ${inviterName ? `<p><strong>Coordinador:</strong> ${inviterName}</p>` : ''}
              </div>
            ` : ''}
            
            ${customMessage ? `
              <div class="study-info">
                <h3>💬 Mensaje Personalizado</h3>
                <p>${customMessage}</p>
              </div>
            ` : ''}
            
            <p>La metodología Delphi es una técnica de comunicación estructurada que permite obtener consenso de un grupo de expertos sobre temas complejos. Su participación es valiosa para alcanzar conclusiones fundamentadas.</p>
            
            <p>Para participar, por favor acceda a nuestra plataforma:</p>
            
            <div style="text-align: center;">
              <a href="${window.location.origin}" class="button">Acceder a la Plataforma</a>
            </div>
            
            <p>Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.</p>
            
            <p>Atentamente,<br>
            ${inviterName || 'El equipo de la Plataforma Delphi'}</p>
          </div>
          
          <div class="footer">
            <p>Este es un mensaje automático de la Plataforma Delphi.</p>
            <p>Si no desea recibir más invitaciones, por favor contáctenos.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}