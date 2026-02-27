export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          academic_level: string | null
          agreed_terms: boolean
          application_type: string
          created_at: string
          cv_url: string | null
          email: string
          field_of_study: string | null
          full_name: string
          id: string
          motivation_letter_url: string | null
          phone: string
          preferred_department: string | null
          preferred_site: string | null
          preferred_start_date: string | null
          status: string
          subject_id: string | null
          tracking_number: string | null
          university: string
          updated_at: string
        }
        Insert: {
          academic_level?: string | null
          agreed_terms?: boolean
          application_type?: string
          created_at?: string
          cv_url?: string | null
          email: string
          field_of_study?: string | null
          full_name: string
          id?: string
          motivation_letter_url?: string | null
          phone: string
          preferred_department?: string | null
          preferred_site?: string | null
          preferred_start_date?: string | null
          status?: string
          subject_id?: string | null
          tracking_number?: string | null
          university: string
          updated_at?: string
        }
        Update: {
          academic_level?: string | null
          agreed_terms?: boolean
          application_type?: string
          created_at?: string
          cv_url?: string | null
          email?: string
          field_of_study?: string | null
          full_name?: string
          id?: string
          motivation_letter_url?: string | null
          phone?: string
          preferred_department?: string | null
          preferred_site?: string | null
          preferred_start_date?: string | null
          status?: string
          subject_id?: string | null
          tracking_number?: string | null
          university?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "pfe_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      interns: {
        Row: {
          id: string
          application_id: string | null
          subject_id: string | null
          full_name: string
          email: string
          matricule: string | null
          internship_type: string
          department: string
          site: string
          supervisor: string | null
          project_title: string | null
          start_date: string | null
          end_date: string | null
          status: string
          final_evaluation_score: number | null
          presentation_score: number | null
          voting_score: number | null
          is_top10: boolean
          recruitment_eligible: boolean
          equipment_returned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id?: string | null
          subject_id?: string | null
          full_name: string
          email: string
          matricule?: string | null
          internship_type?: string
          department: string
          site: string
          supervisor?: string | null
          project_title?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          final_evaluation_score?: number | null
          presentation_score?: number | null
          voting_score?: number | null
          is_top10?: boolean
          recruitment_eligible?: boolean
          equipment_returned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string | null
          subject_id?: string | null
          full_name?: string
          email?: string
          matricule?: string | null
          internship_type?: string
          department?: string
          site?: string
          supervisor?: string | null
          project_title?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          final_evaluation_score?: number | null
          presentation_score?: number | null
          voting_score?: number | null
          is_top10?: boolean
          recruitment_eligible?: boolean
          equipment_returned?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "interns_application_id_fkey", columns: ["application_id"], isOneToOne: false, referencedRelation: "applications", referencedColumns: ["id"] },
          { foreignKeyName: "interns_subject_id_fkey", columns: ["subject_id"], isOneToOne: false, referencedRelation: "pfe_subjects", referencedColumns: ["id"] },
        ]
      }
      presentations: {
        Row: {
          id: string
          intern_id: string
          summary_url: string | null
          presentation_file_url: string | null
          scheduled_at: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          intern_id: string
          summary_url?: string | null
          presentation_file_url?: string | null
          scheduled_at?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          intern_id?: string
          summary_url?: string | null
          presentation_file_url?: string | null
          scheduled_at?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [{ foreignKeyName: "presentations_intern_id_fkey", columns: ["intern_id"], isOneToOne: true, referencedRelation: "interns", referencedColumns: ["id"] }]
      }
      jury_evaluations: {
        Row: {
          id: string
          intern_id: string
          evaluator_email: string
          technical_quality: number
          innovation: number
          impact: number
          presentation_skills: number
          business_value: number
          comments: string | null
          created_at: string
        }
        Insert: {
          id?: string
          intern_id: string
          evaluator_email: string
          technical_quality: number
          innovation: number
          impact: number
          presentation_skills: number
          business_value: number
          comments?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          intern_id?: string
          evaluator_email?: string
          technical_quality?: number
          innovation?: number
          impact?: number
          presentation_skills?: number
          business_value?: number
          comments?: string | null
          created_at?: string
        }
        Relationships: [{ foreignKeyName: "jury_evaluations_intern_id_fkey", columns: ["intern_id"], isOneToOne: false, referencedRelation: "interns", referencedColumns: ["id"] }]
      }
      votes: {
        Row: {
          id: string
          intern_id: string
          voter_id: string
          score: number
          is_anonymous: boolean
          created_at: string
        }
        Insert: {
          id?: string
          intern_id: string
          voter_id: string
          score: number
          is_anonymous?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          intern_id?: string
          voter_id?: string
          score?: number
          is_anonymous?: boolean
          created_at?: string
        }
        Relationships: [{ foreignKeyName: "votes_intern_id_fkey", columns: ["intern_id"], isOneToOne: false, referencedRelation: "interns", referencedColumns: ["id"] }]
      }
      activity_logs: {
        Row: {
          id: string
          entity_type: string
          entity_id: string
          action: string
          actor_email: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          entity_type: string
          entity_id: string
          action: string
          actor_email?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          entity_type?: string
          entity_id?: string
          action?: string
          actor_email?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      pfe_subjects: {
        Row: {
          address: string | null
          created_at: string
          department: string
          description: string
          duration: string | null
          id: string
          max_interns: number
          site: string
          skills: string[] | null
          status: string
          subject_id: string
          supervisor: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          department: string
          description: string
          duration?: string | null
          id?: string
          max_interns?: number
          site: string
          skills?: string[] | null
          status?: string
          subject_id: string
          supervisor?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          department?: string
          description?: string
          duration?: string | null
          id?: string
          max_interns?: number
          site?: string
          skills?: string[] | null
          status?: string
          subject_id?: string
          supervisor?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
