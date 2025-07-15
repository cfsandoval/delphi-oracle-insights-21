import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExperts } from '@/hooks/useExperts';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Info } from 'lucide-react';

interface ExpertImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExpertImport: React.FC<ExpertImportProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const { importExpertsFromCSV } = useExperts();
  const [csvData, setCsvData] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvData(content);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!csvData.trim()) return;

    setIsImporting(true);
    try {
      await importExpertsFromCSV(csvData);
      onOpenChange(false);
      setCsvData('');
    } catch (error) {
      console.error('Error importing experts:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const exampleCSV = `Dr. Juan Pérez,juan@universidad.edu,Economía,Universidad Nacional,15,Doctorado,+1234567890,Especialista en macroeconomía
Dra. María García,maria@instituto.org,Salud Pública,Instituto de Salud,12,Maestría,+0987654321,Experta en epidemiología
Prof. Carlos López,carlos@tech.edu,Tecnología,Instituto Tecnológico,20,Doctorado,+1122334455,Investigador en IA`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('experts.import')}
          </DialogTitle>
          <DialogDescription>
            Importa múltiples expertos desde un archivo CSV o pegando los datos directamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{t('experts.csv.instructions')}</p>
                <p className="text-sm">{t('experts.csv.example')}</p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="csv-file">Seleccionar archivo CSV</Label>
            <input
              id="csv-file"
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-data">O pegar datos CSV directamente</Label>
            <Textarea
              id="csv-data"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder={exampleCSV}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <Alert>
            <AlertDescription>
              <p className="text-sm">
                <strong>Formato esperado por columna:</strong><br />
                1. Nombre (requerido)<br />
                2. Email (requerido)<br />
                3. Área de Expertise<br />
                4. Institución<br />
                5. Años de Experiencia (número)<br />
                6. Nivel Educativo<br />
                7. Teléfono<br />
                8. Notas
              </p>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!csvData.trim() || isImporting}
          >
            {isImporting ? t('common.loading') : 'Importar Expertos'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};