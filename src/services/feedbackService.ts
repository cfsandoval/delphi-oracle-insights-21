export interface FeedbackData {
  page: string;
  comment: string;
  timestamp: string;
  userAgent: string;
}

export class FeedbackService {
  private static instance: FeedbackService;

  static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService();
    }
    return FeedbackService.instance;
  }

  async sendFeedback(feedbackData: FeedbackData): Promise<{ success: boolean; message?: string }> {
    try {
      const supabaseUrl = 'https://xyeblzjuejqreiejnhgv.supabase.co';
      const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZWJsemp1ZWpxcmVpZWpuaGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzkwOTksImV4cCI6MjA2ODExNTA5OX0.1e2Z9lfRIp2Zbda0tCHYmapeK0Z65FLGLuYr05d-j1E';

      const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          to: 'cfsandoval@gmail.com',
          subject: `Feedback - Página: ${feedbackData.page}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                Nuevo Comentario de Usuario
              </h2>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #007bff; margin-top: 0;">Detalles del Comentario</h3>
                <p><strong>Página:</strong> ${feedbackData.page}</p>
                <p><strong>Fecha y Hora:</strong> ${new Date(feedbackData.timestamp).toLocaleString('es-ES')}</p>
                <p><strong>Navegador:</strong> ${feedbackData.userAgent}</p>
              </div>
              
              <div style="background-color: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px;">
                <h3 style="color: #333; margin-top: 0;">Comentario:</h3>
                <p style="line-height: 1.6; color: #555;">${feedbackData.comment.replace(/\n/g, '<br>')}</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px;">
                <p>Este mensaje fue enviado automáticamente desde la plataforma Delphi.</p>
              </div>
            </div>
          `,
          from: 'Delphi Platform <onboarding@resend.dev>',
        }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        return { success: false, message: errorData.error || 'Error al enviar el comentario' };
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      return { success: false, message: 'Error de conexión. Intente nuevamente.' };
    }
  }
}