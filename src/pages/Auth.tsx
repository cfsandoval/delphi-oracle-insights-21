import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { FeedbackTooltip } from '@/components/FeedbackTooltip';

export default function Auth() {
  const { user, signUp, signIn, resetPassword, isLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSigningIn(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: t('auth.welcomeBack'),
        description: t('auth.signInSuccess')
      });
    }
    
    setIsSigningIn(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSigningUp(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const displayName = formData.get('displayName') as string;

    const { error } = await signUp(email, password, displayName);
    
    if (error) {
      setError(error.message);
      toast({
        title: 'Error al registrarse',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      // Redirect to registration pending page
      navigate('/registration-pending');
    }
    
    setIsSigningUp(false);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsResetting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Email enviado',
        description: 'Revisa tu bandeja de entrada para restablecer tu contraseña'
      });
      setShowResetForm(false);
    }
    
    setIsResetting(false);
  };

  const handleTestEmail = async () => {
    try {
      const response = await fetch('https://xyeblzjuejqreiejnhgv.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          to: 'cfsandoval@gmail.com',
          subject: 'Test de Email - Delphi App',
          html: '<h1>Email de prueba</h1><p>Este es un email de prueba del sistema Delphi.</p>'
        })
      });

      if (response.ok) {
        toast({
          title: 'Test exitoso',
          description: 'Email de prueba enviado correctamente'
        });
      } else {
        throw new Error('Error en el envío');
      }
    } catch (error) {
      toast({
        title: 'Error en test',
        description: 'No se pudo enviar el email de prueba',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Delphi Open Source</CardTitle>
          <CardDescription>{t('auth.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">{t('auth.signIn')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
              <TabsTrigger value="reset">Recuperar</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">{t('auth.email')}</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    required
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">{t('auth.password')}</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    required
                    placeholder={t('auth.passwordPlaceholder')}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSigningIn}>
                  {isSigningIn ? t('common.loading') : t('auth.signIn')}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Acceso rápido
                    </span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const emailInput = document.getElementById('signin-email') as HTMLInputElement;
                    const passwordInput = document.getElementById('signin-password') as HTMLInputElement;
                    if (emailInput && passwordInput) {
                      emailInput.value = 'admin@delphi.com';
                      passwordInput.value = 'admin123';
                    }
                  }}
                >
                  🔑 Acceso Admin
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={handleTestEmail}
                >
                  📧 Test Email
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">{t('auth.displayName')}</Label>
                  <Input
                    id="signup-name"
                    name="displayName"
                    type="text"
                    placeholder={t('auth.displayNamePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t('auth.email')}</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    required
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t('auth.password')}</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                    placeholder={t('auth.passwordPlaceholder')}
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSigningUp}>
                  {isSigningUp ? t('common.loading') : t('auth.signUp')}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="reset">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Ingresa tu email"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isResetting}>
                  {isResetting ? 'Enviando...' : 'Enviar email de recuperación'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Feedback tooltip */}
      <FeedbackTooltip pageName="Autenticación (Login/Registro)" />
    </div>
  );
}