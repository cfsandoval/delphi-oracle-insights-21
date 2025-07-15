
import { useState, useEffect } from 'react';
import { Study } from '@/types/study';
import { studyService } from '@/services/studyService';

export const useStudies = () => {
  const [studies, setStudies] = useState<Study[]>([]);

  useEffect(() => {
    setStudies(studyService.getStudies());
    
    const unsubscribe = studyService.subscribe((updatedStudies) => {
      setStudies(updatedStudies);
    });

    return unsubscribe;
  }, []);

  const createStudy = (studyData: Omit<Study, 'id' | 'createdAt'>) => {
    return studyService.createStudy(studyData);
  };

  const updateStudy = (id: string, updates: Partial<Study>) => {
    return studyService.updateStudy(id, updates);
  };

  const deleteStudy = (id: string) => {
    return studyService.deleteStudy(id);
  };

  const getStudyById = (id: string) => {
    return studyService.getStudyById(id);
  };

  return {
    studies,
    createStudy,
    updateStudy,
    deleteStudy,
    getStudyById
  };
};
