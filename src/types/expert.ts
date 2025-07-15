export interface Expert {
  id: string;
  user_id: string;
  name: string;
  email: string;
  expertise_area?: string;
  institution?: string;
  years_experience?: number;
  education_level?: string;
  phone?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'invited' | 'declined';
  created_at: string;
  updated_at: string;
}

export interface StudyParticipant {
  id: string;
  study_id: string;
  expert_id: string;
  invitation_sent_at?: string;
  response_status: 'pending' | 'accepted' | 'declined' | 'completed';
  last_response_at?: string;
  rounds_completed: number;
  created_at: string;
  updated_at: string;
}

export interface ExpertFormData {
  name: string;
  email: string;
  expertise_area?: string;
  institution?: string;
  years_experience?: number;
  education_level?: string;
  phone?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'invited' | 'declined';
}

export interface CSVExpert {
  name: string;
  email: string;
  expertise_area: string;
  institution: string;
  years_experience: string;
  education_level: string;
  phone: string;
  notes: string;
}