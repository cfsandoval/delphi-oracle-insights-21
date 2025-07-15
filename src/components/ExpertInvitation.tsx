import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { EmailService, InvitationEmailData } from '@/services/emailService';
import { Expert } from '@/types/expert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Users } from 'lucide-react';

interface ExpertInvitationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experts: Expert[];
  preSelectedExperts?: Expert[];
}

export const ExpertInvitation: React.FC<ExpertInvitationProps> = ({
  open,
  onOpenChange,
  experts,
  preSelectedExperts = []
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedExperts, setSelectedExperts] = useState<Set<string>>(
    new Set(preSelectedExperts.map(e => e.id))
  );
  const [studyTitle, setStudyTitle] = useState('');
  const [inviterName, setInviterName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailService = new EmailService();

  const handleExpertToggle = (expertId: string) => {
    const newSelected = new Set(selectedExperts);
    if (newSelected.has(expertId)) {
      newSelected.delete(expertId);
    } else {
      newSelected.add(expertId);
    }
    setSelectedExperts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedExperts.size === experts.length) {
      setSelectedExperts(new Set());
    } else {
      setSelectedExperts(new Set(experts.map(e => e.id)));
    }
  };

  const handleSendInvitations = async () => {
    if (selectedExperts.size === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un experto",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const selectedExpertsList = experts.filter(e => selectedExperts.has(e.id));
      const invitations: InvitationEmailData[] = selectedExpertsList.map(expert => ({
        expertName: expert.name,
        expertEmail: expert.email,
        studyTitle: studyTitle || undefined,
        inviterName: inviterName || undefined,
        customMessage: customMessage || undefined,
      }));

      const result = await emailService.sendBulkInvitations(invitations);

      toast({
        title: "Invitaciones enviadas",
        description: `${result.success} invitaciones enviadas exitosamente${result.failed > 0 ? `, ${result.failed} fallaron` : ''}`,
        variant: result.failed === 0 ? "default" : "destructive",
      });

      if (result.success > 0) {
        onOpenChange(false);
        // Reset form
        setSelectedExperts(new Set());
        setStudyTitle('');
        setInviterName('');
        setCustomMessage('');
      }
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast({
        title: "Error",
        description: "Error al enviar las invitaciones. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Enviar Invitaciones por Email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Study Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información del Estudio</h3>
            
            <div className="space-y-2">
              <Label htmlFor="studyTitle">Título del Estudio (Opcional)</Label>
              <Input
                id="studyTitle"
                value={studyTitle}
                onChange={(e) => setStudyTitle(e.target.value)}
                placeholder="Ej: Consenso sobre tecnologías emergentes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviterName">Su Nombre (Opcional)</Label>
              <Input
                id="inviterName"
                value={inviterName}
                onChange={(e) => setInviterName(e.target.value)}
                placeholder="Ej: Dr. Juan Pérez"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customMessage">Mensaje Personalizado (Opcional)</Label>
              <Textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Agregue un mensaje personalizado para los expertos..."
                rows={3}
              />
            </div>
          </div>

          {/* Expert Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Seleccionar Expertos</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                {selectedExperts.size === experts.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </Button>
            </div>

            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
              {experts.map((expert) => (
                <div key={expert.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded">
                  <Checkbox
                    id={expert.id}
                    checked={selectedExperts.has(expert.id)}
                    onCheckedChange={() => handleExpertToggle(expert.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={expert.id} className="text-sm font-medium cursor-pointer">
                      {expert.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">{expert.email}</p>
                    {expert.expertise_area && (
                      <p className="text-xs text-muted-foreground">{expert.expertise_area}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              {selectedExperts.size} de {experts.length} expertos seleccionados
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendInvitations}
              disabled={isLoading || selectedExperts.size === 0}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? 'Enviando...' : `Enviar Invitaciones (${selectedExperts.size})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};