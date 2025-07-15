import { useState, useEffect } from 'react';
import { Study } from '@/types/study';
import { SupabaseStudyService } from '@/services/supabaseStudyService';
import { useAuth } from '@/contexts/AuthContext';

const studyService = new SupabaseStudyService();

export const useSupabaseStudies = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const loadStudies = async () => {
    if (!user) {
      setStudies([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userStudies = await studyService.getStudies();
      setStudies(userStudies);
    } catch (error) {
      console.error('Error loading studies:', error);
      setStudies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudies();
  }, [user]);

  const createStudy = async (studyData: Omit<Study, 'id' | 'createdAt'>) => {
    if (!user) {
      throw new Error('User must be authenticated to create studies');
    }

    try {
      const newStudy = await studyService.createStudy(studyData);
      if (newStudy) {
        await loadStudies(); // Reload studies
        return newStudy;
      }
      throw new Error('Failed to create study');
    } catch (error) {
      console.error('Error creating study:', error);
      throw error;
    }
  };

  const updateStudy = async (id: string, updates: Partial<Study>) => {
    try {
      const updatedStudy = await studyService.updateStudy(id, updates);
      if (updatedStudy) {
        await loadStudies(); // Reload studies
        return updatedStudy;
      }
      return null;
    } catch (error) {
      console.error('Error updating study:', error);
      throw error;
    }
  };

  const deleteStudy = async (id: string) => {
    try {
      const success = await studyService.deleteStudy(id);
      if (success) {
        await loadStudies(); // Reload studies
      }
      return success;
    } catch (error) {
      console.error('Error deleting study:', error);
      throw error;
    }
  };

  const getStudyById = async (id: string) => {
    try {
      return await studyService.getStudyById(id);
    } catch (error) {
      console.error('Error fetching study:', error);
      return null;
    }
  };

  return {
    studies,
    isLoading,
    createStudy,
    updateStudy,
    deleteStudy,
    getStudyById,
    refreshStudies: loadStudies
  };
};