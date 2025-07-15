import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail, ArrowLeft } from 'lucide-react';
import { FeedbackTooltip } from '@/components/FeedbackTooltip';

export default function RegistrationPending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">¡Registro Exitoso!</CardTitle>
          <CardDescription className="text-base">
            Tu cuenta ha sido creada correctamente
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center mb-3">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800 mb-2">Verifica tu correo electrónico</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Hemos enviado un enlace de confirmación a tu correo electrónico. 
              Haz clic en el enlace para activar tu cuenta y acceder a la plataforma.
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              ¿No ves el correo? Revisa tu carpeta de spam o correo no deseado.
            </p>
            
            <div className="border-t pt-4">
              <p className="text-xs text-gray-500 mb-3">
                Una vez que confirmes tu correo, podrás acceder a todas las funcionalidades de la plataforma Delphi.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth" className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver al Login
              </Link>
            </Button>
            
            <Button asChild className="w-full">
              <Link to="/">
                Ir al Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Feedback tooltip */}
      <FeedbackTooltip pageName="Registro Pendiente" />
    </div>
  );
}