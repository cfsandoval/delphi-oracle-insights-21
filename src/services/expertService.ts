import { supabase } from '@/integrations/supabase/client';
import { Expert, ExpertFormData } from '@/types/expert';

export class ExpertService {
  async getExperts(): Promise<Expert[]> {
    const { data, error } = await supabase
      .from('experts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching experts:', error);
      throw error;
    }

    return (data || []) as Expert[];
  }

  async getExpertById(id: string): Promise<Expert | null> {
    const { data, error } = await supabase
      .from('experts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching expert:', error);
      throw error;
    }

    return data as Expert | null;
  }

  async createExpert(expertData: ExpertFormData): Promise<Expert> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create experts');
    }

    const { data, error } = await supabase
      .from('experts')
      .insert({
        user_id: user.id,
        ...expertData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating expert:', error);
      throw error;
    }

    return data as Expert;
  }

  async updateExpert(id: string, updates: Partial<ExpertFormData>): Promise<Expert> {
    const { data, error } = await supabase
      .from('experts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating expert:', error);
      throw error;
    }

    return data as Expert;
  }

  async deleteExpert(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('experts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting expert:', error);
      throw error;
    }

    return true;
  }

  async importExpertsFromCSV(csvData: string): Promise<Expert[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to import experts');
    }

    const lines = csvData.trim().split('\n');
    const experts: ExpertFormData[] = [];

    // Skip header row if present
    const startIndex = lines[0].toLowerCase().includes('nombre') || lines[0].toLowerCase().includes('name') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = this.parseCSVLine(line);
      if (columns.length >= 2) { // At least name and email required
        const expert: ExpertFormData = {
          name: columns[0]?.trim() || '',
          email: columns[1]?.trim() || '',
          expertise_area: columns[2]?.trim() || '',
          institution: columns[3]?.trim() || '',
          years_experience: columns[4] ? parseInt(columns[4].trim()) || undefined : undefined,
          education_level: columns[5]?.trim() || '',
          phone: columns[6]?.trim() || '',
          notes: columns[7]?.trim() || '',
          status: 'active' as const
        };

        if (expert.name && expert.email) {
          experts.push(expert);
        }
      }
    }

    if (experts.length === 0) {
      throw new Error('No valid expert data found in CSV');
    }

    // Insert experts with user_id
    const expertsWithUserId = experts.map(expert => ({
      ...expert,
      user_id: user.id
    }));

    const { data, error } = await supabase
      .from('experts')
      .insert(expertsWithUserId)
      .select();

    if (error) {
      console.error('Error importing experts:', error);
      throw error;
    }

    return (data || []) as Expert[];
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  async exportExpertsToCSV(): Promise<string> {
    const experts = await this.getExperts();
    
    const headers = [
      'Nombre',
      'Email',
      'Área de Expertise',
      'Institución',
      'Años de Experiencia',
      'Nivel Educativo',
      'Teléfono',
      'Notas',
      'Estado'
    ];

    const csvLines = [headers.join(',')];

    experts.forEach(expert => {
      const row = [
        `"${expert.name}"`,
        `"${expert.email}"`,
        `"${expert.expertise_area || ''}"`,
        `"${expert.institution || ''}"`,
        expert.years_experience?.toString() || '',
        `"${expert.education_level || ''}"`,
        `"${expert.phone || ''}"`,
        `"${expert.notes || ''}"`,
        `"${expert.status}"`
      ];
      csvLines.push(row.join(','));
    });

    return csvLines.join('\n');
  }
}