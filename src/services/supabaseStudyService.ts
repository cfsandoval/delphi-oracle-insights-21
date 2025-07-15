import { supabase } from '@/integrations/supabase/client';
import { Study } from '@/types/study';

export class SupabaseStudyService {
  async getStudies(): Promise<Study[]> {
    const { data, error } = await supabase
      .from('studies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching studies:', error);
      return [];
    }

    return data.map(this.mapDbStudyToStudy);
  }

  async getStudyById(id: string): Promise<Study | null> {
    const { data, error } = await supabase
      .from('studies')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching study:', error);
      return null;
    }

    return data ? this.mapDbStudyToStudy(data) : null;
  }

  async createStudy(studyData: Omit<Study, 'id' | 'createdAt'>): Promise<Study | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create studies');
    }

    const dbStudy = {
      user_id: user.id,
      title_es: studyData.title.es,
      title_en: studyData.title.en,
      description_es: studyData.description?.es || '',
      description_en: studyData.description?.en || '',
      type: studyData.methodology,
      status: studyData.status,
      category: studyData.category || 'general',
      rounds_data: { rounds: studyData.rounds, currentRound: studyData.currentRound, experts: studyData.experts, consensus: studyData.consensus },
      settings: {}
    };

    const { data, error } = await supabase
      .from('studies')
      .insert(dbStudy)
      .select()
      .single();

    if (error) {
      console.error('Error creating study:', error);
      throw error;
    }

    return this.mapDbStudyToStudy(data);
  }

  async updateStudy(id: string, updates: Partial<Study>): Promise<Study | null> {
    const dbUpdates: any = {};

    if (updates.title) {
      dbUpdates.title_es = updates.title.es;
      dbUpdates.title_en = updates.title.en;
    }

    if (updates.description) {
      dbUpdates.description_es = updates.description.es;
      dbUpdates.description_en = updates.description.en;
    }

    if (updates.methodology) dbUpdates.type = updates.methodology;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.rounds !== undefined || updates.currentRound !== undefined || updates.experts !== undefined || updates.consensus !== undefined) {
      dbUpdates.rounds_data = { 
        rounds: updates.rounds ?? 0, 
        currentRound: updates.currentRound ?? 0, 
        experts: updates.experts ?? 0, 
        consensus: updates.consensus ?? 0 
      };
    }

    const { data, error } = await supabase
      .from('studies')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating study:', error);
      return null;
    }

    return this.mapDbStudyToStudy(data);
  }

  async deleteStudy(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('studies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting study:', error);
      return false;
    }

    return true;
  }

  private mapDbStudyToStudy(dbStudy: any): Study {
    const roundsData = dbStudy.rounds_data || {};
    return {
      id: dbStudy.id,
      title: {
        es: dbStudy.title_es,
        en: dbStudy.title_en
      },
      description: {
        es: dbStudy.description_es,
        en: dbStudy.description_en
      },
      methodology: dbStudy.type,
      status: dbStudy.status,
      category: dbStudy.category || 'general',
      rounds: roundsData.rounds || 0,
      currentRound: roundsData.currentRound || 0,
      experts: roundsData.experts || 0,
      consensus: roundsData.consensus || 0,
      createdAt: new Date(dbStudy.created_at).toISOString().split('T')[0]
    };
  }
}