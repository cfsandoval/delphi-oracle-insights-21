import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { FeedbackService } from '@/services/feedbackService';

interface FeedbackTooltipProps {
  pageName: string;
}

export const FeedbackTooltip: React.FC<FeedbackTooltipProps> = ({ pageName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error('Por favor ingrese un comentario');
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackService = FeedbackService.getInstance();
      const result = await feedbackService.sendFeedback({
        page: pageName,
        comment: comment.trim(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      });

      if (result.success) {
        toast.success('¡Comentario enviado exitosamente!');
        setComment('');
        setIsOpen(false);
      } else {
        toast.error(result.message || 'Error al enviar comentario');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Error al enviar comentario. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="lg"
              className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-full w-16 h-16 animate-pulse hover:animate-none hover:scale-110 border-2 border-white/20"
              onClick={() => setIsOpen(true)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-gray-900 text-white border-gray-700">
            <p className="font-medium">💬 Enviar comentario sobre esta página</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md border-2 border-blue-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <MessageCircle className="h-5 w-5" />
              Enviar Comentario
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              📍 Comparte tu experiencia o reporta problemas en la página: <strong className="text-blue-600">{pageName}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              placeholder="💭 Describe tu experiencia, sugerencias o problemas que encontraste..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none border-2 border-gray-200 focus:border-blue-400 transition-colors"
            />
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
              💡 <strong>Tip:</strong> Tu comentario será enviado directamente al equipo de desarrollo para mejorar la plataforma.
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !comment.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar Comentario
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};