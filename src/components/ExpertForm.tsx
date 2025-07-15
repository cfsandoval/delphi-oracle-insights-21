import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExperts } from '@/hooks/useExperts';
import { Expert, ExpertFormData } from '@/types/expert';
import { SecurityUtils } from '@/lib/security';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ExpertFormProps {
  expert?: Expert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExpertForm: React.FC<ExpertFormProps> = ({ expert, open, onOpenChange }) => {
  const { t } = useLanguage();
  const { createExpert, updateExpert } = useExperts();
  const isEditing = !!expert;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ExpertFormData>({
    defaultValues: expert ? {
      name: expert.name,
      email: expert.email,
      expertise_area: expert.expertise_area,
      institution: expert.institution,
      years_experience: expert.years_experience,
      education_level: expert.education_level,
      phone: expert.phone,
      notes: expert.notes,
      status: expert.status
    } : {
      status: 'active'
    }
  });

  React.useEffect(() => {
    if (expert) {
      reset({
        name: expert.name,
        email: expert.email,
        expertise_area: expert.expertise_area,
        institution: expert.institution,
        years_experience: expert.years_experience,
        education_level: expert.education_level,
        phone: expert.phone,
        notes: expert.notes,
        status: expert.status
      });
    } else {
      reset({ status: 'active' });
    }
  }, [expert, reset]);

  const onSubmit = async (data: ExpertFormData) => {
    try {
      if (isEditing && expert) {
        await updateExpert(expert.id, data);
      } else {
        await createExpert(data);
      }
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Error saving expert:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('experts.form.title.edit') : t('experts.form.title.add')}
          </DialogTitle>
          <DialogDescription>
            Complete la información del experto. Los campos marcados son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('experts.name')} *</Label>
              <Input
                id="name"
                 {...register('name', { 
                  required: t('experts.validation.required'),
                  maxLength: { value: 100, message: 'Name is too long' },
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿñÑ\s\.,-]+$/,
                    message: 'Name contains invalid characters'
                  }
                })}
                placeholder="Dr. Juan Pérez"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('experts.email')} *</Label>
              <Input
                id="email"
                type="email"
                 {...register('email', { 
                  required: t('experts.validation.required'),
                  validate: {
                    validEmail: (value) => SecurityUtils.isValidEmail(value) || 'Email format is invalid',
                    maxLength: (value) => value.length <= 254 || 'Email is too long'
                  }
                })}
                placeholder="juan@universidad.edu"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertise_area">{t('experts.expertise')}</Label>
              <Input
                id="expertise_area"
                {...register('expertise_area')}
                placeholder="Economía, Salud Pública, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">{t('experts.institution')}</Label>
              <Input
                id="institution"
                {...register('institution')}
                placeholder="Universidad Nacional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_experience">{t('experts.experience')}</Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                {...register('years_experience', {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: t('experts.validation.experience')
                  }
                })}
                placeholder="15"
              />
              {errors.years_experience && (
                <p className="text-sm text-red-600">{errors.years_experience.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="education_level">{t('experts.education')}</Label>
              <Select 
                value={watch('education_level')} 
                onValueChange={(value) => setValue('education_level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nivel educativo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                  <SelectItem value="Maestría">Maestría</SelectItem>
                  <SelectItem value="Doctorado">Doctorado</SelectItem>
                  <SelectItem value="Postdoctorado">Postdoctorado</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('experts.phone')}</Label>
              <Input
                id="phone"
                {...register('phone', {
                  validate: {
                    validPhone: (value) => !value || SecurityUtils.isValidPhone(value) || 'Invalid phone number format'
                  }
                })}
                placeholder="+1234567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t('experts.status')}</Label>
              <Select 
                value={watch('status')} 
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('experts.status.active')}</SelectItem>
                  <SelectItem value="inactive">{t('experts.status.inactive')}</SelectItem>
                  <SelectItem value="invited">{t('experts.status.invited')}</SelectItem>
                  <SelectItem value="declined">{t('experts.status.declined')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('experts.notes')}</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Especialista en macroeconomía con enfoque en políticas públicas..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.loading') : (isEditing ? 'Actualizar' : t('common.create'))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};