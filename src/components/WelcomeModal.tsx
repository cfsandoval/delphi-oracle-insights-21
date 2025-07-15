import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome message
    const hasSeenWelcome = localStorage.getItem('delphi-welcome-seen');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('delphi-welcome-seen', 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            ¡Bienvenido a Delphi!
          </DialogTitle>
          <DialogDescription className="text-center space-y-3">
            <p>
              Esta es tu plataforma para realizar estudios Delphi de manera profesional.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm text-blue-800 font-medium">
                💡 <strong>Tip importante:</strong> En la esquina inferior derecha encontrarás un botón de comentarios donde puedes enviar tus aportes y sugerencias.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              ¡Tu feedback es muy valioso para mejorar la plataforma!
            </p>
          </DialogDescription>
        </DialogHeader>
        <Button onClick={handleClose} className="w-full">
          Entendido
        </Button>
      </DialogContent>
    </Dialog>
  );
};