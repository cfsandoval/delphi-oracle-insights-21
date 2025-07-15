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
              variant="ghost"
              size="sm"
              className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
              onClick={() => setIsOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enviar comentario sobre esta página</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Comentario</DialogTitle>
            <DialogDescription>
              Comparte tu experiencia o reporta problemas en la página: <strong>{pageName}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Describe tu experiencia, sugerencias o problemas que encontraste..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !comment.trim()}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};