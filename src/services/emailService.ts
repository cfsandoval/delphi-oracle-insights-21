import { supabase } from '@/integrations/supabase/client';
import { SecurityUtils } from '@/lib/security';

export interface InvitationEmailData {
  expertName: string;
  expertEmail: string;
  studyTitle?: string;
  studyDescription?: string;
  inviterName?: string;
  inviterEmail?: string;
  customMessage?: string;
  studyId?: string;
  estimatedDuration?: string;
  numberOfRounds?: string;
  expertiseArea?: string;
}

export class EmailService {
  async sendExpertInvitation(data: InvitationEmailData): Promise<boolean> {
    try {
      // Validate email format
      if (!SecurityUtils.isValidEmail(data.expertEmail)) {
        console.error('Invalid email address:', data.expertEmail);
        return false;
      }

      // Check rate limiting
      if (SecurityUtils.isRateLimited(data.expertEmail, 3, 300000)) {
        console.error('Rate limit exceeded for email:', data.expertEmail);
        return false;
      }

      // Sanitize data
      const sanitizedData = this.sanitizeEmailData(data);

      // Generate HTML content
      const html = this.generateInvitationHTML(sanitizedData);

      console.log('Attempting to send email to:', sanitizedData.expertEmail);

      // Send email via Supabase function
      const { data: response, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: sanitizedData.expertEmail,
          subject: `Invitation to participate in: ${sanitizedData.studyTitle || 'Delphi Study'}`,
          html: html,
          from: 'Delphi Platform <onboarding@resend.dev>'
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return false;
      }

      console.log('Email sent successfully:', response);
      return true;

    } catch (error) {
      console.error('Error in sendExpertInvitation:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
      return false;
    }
  }

  async testEmailConfiguration(): Promise<{ success: boolean; message: string }> {
    const testEmail = 'test@example.com';
    
    try {
      console.log('Testing email configuration...');
      
      const { data: response, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: testEmail,
          subject: 'Test Email Configuration',
          html: '<h1>Test Email</h1><p>This is a test email to verify the configuration.</p>',
          from: 'Delphi Platform <onboarding@resend.dev>'
        }
      });

      if (error) {
        console.error('Email configuration test failed:', error);
        return {
          success: false,
          message: `Configuration test failed: ${error.message || 'Unknown error'}`
        };
      }

      console.log('Email configuration test successful:', response);
      return {
        success: true,
        message: 'Email configuration is working correctly'
      };

    } catch (error) {
      console.error('Email configuration test error:', error);
      return {
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
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
      studyDescription: data.studyDescription ? SecurityUtils.validateAndSanitizeText(data.studyDescription, 500) : undefined,
      inviterName: data.inviterName ? SecurityUtils.validateAndSanitizeText(data.inviterName, 100) : undefined,
      inviterEmail: data.inviterEmail ? data.inviterEmail.toLowerCase().trim() : undefined,
      customMessage: data.customMessage ? SecurityUtils.validateAndSanitizeText(data.customMessage, 500) : undefined,
      studyId: data.studyId,
      estimatedDuration: data.estimatedDuration ? SecurityUtils.validateAndSanitizeText(data.estimatedDuration, 100) : undefined,
      numberOfRounds: data.numberOfRounds ? SecurityUtils.validateAndSanitizeText(data.numberOfRounds, 50) : undefined,
      expertiseArea: data.expertiseArea ? SecurityUtils.validateAndSanitizeText(data.expertiseArea, 200) : undefined,
    };
  }

  private generateInvitationHTML(data: InvitationEmailData): string {
    // Use a configurable base URL instead of window.location.origin (which doesn't work server-side)
    const baseUrl = 'https://lovable.dev/projects/xyeblzjuejqreiejnhgv';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Invitation to Participate in Delphi Study</title>
          <style>
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border: 1px solid #e0e0e0;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
            .study-info {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Invitation to Participate in Delphi Study</h1>
            </div>
            <div class="content">
              <p>Dear ${data.expertName},</p>
              
              <p>You have been invited to participate in a Delphi study. ${data.expertiseArea ? `Your expertise in <strong>${data.expertiseArea}</strong> makes you a valuable contributor to this research.` : 'Your expertise makes you a valuable contributor to this research.'}</p>
              
              <div class="study-info">
                <h3>Study Details:</h3>
                <p><strong>Title:</strong> ${data.studyTitle || 'Delphi Study'}</p>
                ${data.studyDescription ? `<p><strong>Description:</strong> ${data.studyDescription}</p>` : ''}
                <p><strong>Estimated Duration:</strong> ${data.estimatedDuration || 'To be determined'}</p>
                <p><strong>Number of Rounds:</strong> ${data.numberOfRounds || 'To be determined'}</p>
              </div>
              
              ${data.customMessage ? `
                <div style="margin: 20px 0; padding: 15px; background: #e8f4f8; border-radius: 6px;">
                  <h4>Message from the researcher:</h4>
                  <p>${data.customMessage}</p>
                </div>
              ` : ''}
              
              <p>To participate in this study, please click the button below:</p>
              
              <div style="text-align: center;">
                <a href="${baseUrl}${data.studyId ? `/study/${data.studyId}` : ''}" class="button">
                  Join Study
                </a>
              </div>
              
              <p>If you have any questions, please contact the study coordinator:</p>
              <p><strong>${data.inviterName || 'Study Coordinator'}</strong><br>
              ${data.inviterEmail ? `Email: ${data.inviterEmail}` : ''}</p>
              
              <p>Thank you for your time and consideration.</p>
              
              <p>Best regards,<br>
              The Delphi Research Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message from the Delphi Research Platform.</p>
              <p>If you received this email in error, please disregard it.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}