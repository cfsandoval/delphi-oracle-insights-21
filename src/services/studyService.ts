
import { Study } from "@/types/study";
import { mockStudies } from "@/data/mockStudies";

class StudyService {
  private studies: Study[] = [...mockStudies];
  private listeners: ((studies: Study[]) => void)[] = [];

  subscribe(listener: (studies: Study[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.studies]));
  }

  getStudies(): Study[] {
    return [...this.studies];
  }

  getStudyById(id: string): Study | undefined {
    return this.studies.find(study => study.id === id);
  }

  createStudy(studyData: Omit<Study, 'id' | 'createdAt'>): Study {
    const newStudy: Study = {
      ...studyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    this.studies.push(newStudy);
    this.notify();
    return newStudy;
  }

  updateStudy(id: string, updates: Partial<Study>): Study | null {
    const index = this.studies.findIndex(study => study.id === id);
    if (index === -1) return null;
    
    this.studies[index] = { ...this.studies[index], ...updates };
    this.notify();
    return this.studies[index];
  }

  deleteStudy(id: string): boolean {
    const index = this.studies.findIndex(study => study.id === id);
    if (index === -1) return false;
    
    this.studies.splice(index, 1);
    this.notify();
    return true;
  }
}

export const studyService = new StudyService();
