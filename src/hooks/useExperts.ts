import { useState, useEffect } from 'react';
import { Expert, ExpertFormData } from '@/types/expert';
import { ExpertService } from '@/services/expertService';
import { useToast } from '@/hooks/use-toast';

export const useExperts = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const expertService = new ExpertService();

  const fetchExperts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const expertsData = await expertService.getExperts();
      setExperts(expertsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching experts';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createExpert = async (expertData: ExpertFormData): Promise<Expert | null> => {
    try {
      const newExpert = await expertService.createExpert(expertData);
      setExperts(prev => [newExpert, ...prev]);
      toast({
        title: 'Éxito',
        description: 'Experto creado correctamente'
      });
      return newExpert;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating expert';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateExpert = async (id: string, updates: Partial<ExpertFormData>): Promise<Expert | null> => {
    try {
      const updatedExpert = await expertService.updateExpert(id, updates);
      setExperts(prev => prev.map(expert => expert.id === id ? updatedExpert : expert));
      toast({
        title: 'Éxito',
        description: 'Experto actualizado correctamente'
      });
      return updatedExpert;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating expert';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    }
  };

  const deleteExpert = async (id: string): Promise<boolean> => {
    try {
      await expertService.deleteExpert(id);
      setExperts(prev => prev.filter(expert => expert.id !== id));
      toast({
        title: 'Éxito',
        description: 'Experto eliminado correctamente'
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting expert';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  };

  const importExpertsFromCSV = async (csvData: string): Promise<Expert[]> => {
    try {
      const importedExperts = await expertService.importExpertsFromCSV(csvData);
      setExperts(prev => [...importedExperts, ...prev]);
      toast({
        title: 'Éxito',
        description: `${importedExperts.length} expertos importados correctamente`
      });
      return importedExperts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error importing experts';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return [];
    }
  };

  const exportExpertsToCSV = async (): Promise<string | null> => {
    try {
      const csvData = await expertService.exportExpertsToCSV();
      toast({
        title: 'Éxito',
        description: 'Expertos exportados correctamente'
      });
      return csvData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error exporting experts';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  return {
    experts,
    isLoading,
    error,
    createExpert,
    updateExpert,
    deleteExpert,
    importExpertsFromCSV,
    exportExpertsToCSV,
    refetch: fetchExperts
  };
};