import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExperts } from '@/hooks/useExperts';
import { Expert } from '@/types/expert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExpertForm } from './ExpertForm';
import { MoreHorizontal, Edit, Trash2, Mail } from 'lucide-react';

interface ExpertTableProps {
  experts: Expert[];
  isLoading: boolean;
}

export const ExpertTable: React.FC<ExpertTableProps> = ({ experts, isLoading }) => {
  const { t } = useLanguage();
  const { deleteExpert } = useExperts();
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'invited': return 'bg-blue-100 text-blue-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (expert: Expert) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${expert.name}?`)) {
      await deleteExpert(expert.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (experts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          {t('experts.empty.title')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('experts.empty.description')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('experts.name')}</TableHead>
              <TableHead>{t('experts.email')}</TableHead>
              <TableHead>{t('experts.expertise')}</TableHead>
              <TableHead>{t('experts.institution')}</TableHead>
              <TableHead>{t('experts.experience')}</TableHead>
              <TableHead>{t('experts.status')}</TableHead>
              <TableHead className="w-[50px]">{t('experts.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experts.map((expert) => (
              <TableRow key={expert.id}>
                <TableCell className="font-medium">{expert.name}</TableCell>
                <TableCell>{expert.email}</TableCell>
                <TableCell>{expert.expertise_area || '-'}</TableCell>
                <TableCell>{expert.institution || '-'}</TableCell>
                <TableCell>{expert.years_experience ? `${expert.years_experience} años` : '-'}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(expert.status)}>
                    {t(`experts.status.${expert.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingExpert(expert)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t('experts.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => window.open(`mailto:${expert.email}`, '_blank')}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        {t('experts.invite')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(expert)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('experts.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Formulario de edición */}
      <ExpertForm 
        expert={editingExpert}
        open={!!editingExpert}
        onOpenChange={(open) => !open && setEditingExpert(null)}
      />
    </>
  );
};