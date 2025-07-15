import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExperts } from '@/hooks/useExperts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpertTable } from './ExpertTable';
import { ExpertForm } from './ExpertForm';
import { ExpertImport } from './ExpertImport';
import { ExpertInvitation } from './ExpertInvitation';
import { Plus, Download, Upload, Users, Mail } from 'lucide-react';

export const ExpertManagement: React.FC = () => {
  const { t } = useLanguage();
  const { experts, isLoading, exportExpertsToCSV } = useExperts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);

  const filteredExperts = experts.filter(expert =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.expertise_area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.institution?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = async () => {
    const csvData = await exportExpertsToCSV();
    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `expertos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('experts.title')}</h1>
          <p className="text-muted-foreground">{t('experts.description')}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {experts.length} expertos
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {t('experts.import')}
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={experts.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t('experts.export')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowInvitation(true)}
            disabled={experts.length === 0}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Enviar Invitaciones
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('experts.add')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('experts.title')}</CardTitle>
          <CardDescription>
            {experts.length > 0 
              ? `Mostrando ${filteredExperts.length} de ${experts.length} expertos`
              : 'No hay expertos registrados'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpertTable 
            experts={filteredExperts} 
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Formulario de experto */}
      <ExpertForm 
        open={showForm}
        onOpenChange={setShowForm}
      />

      {/* Importar CSV */}
      <ExpertImport 
        open={showImport}
        onOpenChange={setShowImport}
      />

      {/* Enviar Invitaciones */}
      <ExpertInvitation
        open={showInvitation}
        onOpenChange={setShowInvitation}
        experts={experts}
      />
    </div>
  );
};