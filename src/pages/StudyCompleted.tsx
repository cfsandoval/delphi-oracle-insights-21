import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const StudyCompleted: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  
  const state = location.state as { studyTitle?: string; round?: number } || {};
  const { studyTitle, round } = state;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">
              {language === 'es' ? '¡Gracias por su participación!' : 'Thank you for your participation!'}
            </CardTitle>
            <CardDescription className="text-lg">
              {language === 'es' 
                ? 'Sus respuestas han sido enviadas exitosamente'
                : 'Your responses have been submitted successfully'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {studyTitle && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  {language === 'es' ? 'Estudio completado:' : 'Study completed:'}
                </h3>
                <p className="text-sm text-muted-foreground">{studyTitle}</p>
                {round && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'es' ? `Ronda ${round}` : `Round ${round}`}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold">
                {language === 'es' ? '¿Qué sigue?' : 'What\'s next?'}
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-0.5 text-primary" />
                  <p>
                    {language === 'es' 
                      ? 'Recibirá una notificación por correo electrónico cuando esté disponible la siguiente ronda del estudio.'
                      : 'You will receive an email notification when the next round of the study is available.'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-primary" />
                  <p>
                    {language === 'es' 
                      ? 'Sus respuestas son anónimas y serán utilizadas únicamente para fines de investigación.'
                      : 'Your responses are anonymous and will be used solely for research purposes.'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="h-4 w-4 mt-0.5 text-primary" />
                  <p>
                    {language === 'es' 
                      ? 'Puede cerrar esta ventana de forma segura. No es necesario realizar ninguna acción adicional.'
                      : 'You can safely close this window. No additional action is required.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => navigate('/')}>
                  <Home className="h-4 w-4 mr-2" />
                  {language === 'es' ? 'Ir al inicio' : 'Go to home'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                {language === 'es' 
                  ? 'Si tiene alguna pregunta sobre este estudio, puede contactar al equipo de investigación.'
                  : 'If you have any questions about this study, you can contact the research team.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyCompleted;