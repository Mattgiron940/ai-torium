export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          username: string | null
          grade_level: string | null
          subjects_of_interest: string[] | null
          learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | null
          timezone: string | null
          preferred_language: string | null
          total_points: number
          current_streak: number
          longest_streak: number
          level_id: number
          badges: string[]
          subscription_tier: 'free' | 'premium' | 'pro' | 'enterprise'
          questions_used_today: number
          questions_limit: number
          last_question_reset: string
          total_questions_asked: number
          total_answers_given: number
          favorite_subjects: string[] | null
          study_session_count: number
          total_study_time_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          username?: string | null
          grade_level?: string | null
          subjects_of_interest?: string[] | null
          learning_style?: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | null
          timezone?: string | null
          preferred_language?: string | null
          total_points?: number
          current_streak?: number
          longest_streak?: number
          level_id?: number
          badges?: string[]
          subscription_tier?: 'free' | 'premium' | 'pro' | 'enterprise'
          questions_used_today?: number
          questions_limit?: number
          last_question_reset?: string
          total_questions_asked?: number
          total_answers_given?: number
          favorite_subjects?: string[] | null
          study_session_count?: number
          total_study_time_minutes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          username?: string | null
          grade_level?: string | null
          subjects_of_interest?: string[] | null
          learning_style?: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | null
          timezone?: string | null
          preferred_language?: string | null
          total_points?: number
          current_streak?: number
          longest_streak?: number
          level_id?: number
          badges?: string[]
          subscription_tier?: 'free' | 'premium' | 'pro' | 'enterprise'
          questions_used_today?: number
          questions_limit?: number
          last_question_reset?: string
          total_questions_asked?: number
          total_answers_given?: number
          favorite_subjects?: string[] | null
          study_session_count?: number
          total_study_time_minutes?: number
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon_url: string | null
          color_hex: string | null
          difficulty_levels: string[]
          parent_subject_id: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon_url?: string | null
          color_hex?: string | null
          difficulty_levels?: string[]
          parent_subject_id?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon_url?: string | null
          color_hex?: string | null
          difficulty_levels?: string[]
          parent_subject_id?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          title: string
          content: string
          question_type: 'text' | 'image' | 'mixed' | 'voice'
          difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null
          image_urls: string[] | null
          audio_url: string | null
          ocr_extracted_text: string | null
          latex_content: string | null
          claude_complexity_score: number | null
          estimated_solve_time_minutes: number | null
          required_knowledge_areas: string[] | null
          ai_generated_tags: string[] | null
          status: 'pending' | 'answered' | 'verified' | 'featured'
          is_urgent: boolean
          is_homework: boolean
          is_test_prep: boolean
          view_count: number
          upvotes: number
          downvotes: number
          bookmark_count: number
          created_at: string
          updated_at: string
          answered_at: string | null
          deadline: string | null
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          title: string
          content: string
          question_type?: 'text' | 'image' | 'mixed' | 'voice'
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null
          image_urls?: string[] | null
          audio_url?: string | null
          ocr_extracted_text?: string | null
          latex_content?: string | null
          claude_complexity_score?: number | null
          estimated_solve_time_minutes?: number | null
          required_knowledge_areas?: string[] | null
          ai_generated_tags?: string[] | null
          status?: 'pending' | 'answered' | 'verified' | 'featured'
          is_urgent?: boolean
          is_homework?: boolean
          is_test_prep?: boolean
          view_count?: number
          upvotes?: number
          downvotes?: number
          bookmark_count?: number
          created_at?: string
          updated_at?: string
          answered_at?: string | null
          deadline?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          title?: string
          content?: string
          question_type?: 'text' | 'image' | 'mixed' | 'voice'
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null
          image_urls?: string[] | null
          audio_url?: string | null
          ocr_extracted_text?: string | null
          latex_content?: string | null
          claude_complexity_score?: number | null
          estimated_solve_time_minutes?: number | null
          required_knowledge_areas?: string[] | null
          ai_generated_tags?: string[] | null
          status?: 'pending' | 'answered' | 'verified' | 'featured'
          is_urgent?: boolean
          is_homework?: boolean
          is_test_prep?: boolean
          view_count?: number
          upvotes?: number
          downvotes?: number
          bookmark_count?: number
          created_at?: string
          updated_at?: string
          answered_at?: string | null
          deadline?: string | null
        }
      }
      answers: {
        Row: {
          id: string
          question_id: string
          user_id: string | null
          content: string
          answer_type: 'ai' | 'human' | 'hybrid'
          confidence_score: number | null
          claude_model_used: string | null
          processing_time_ms: number | null
          tokens_used: number | null
          reasoning_steps: Json | null
          sources_cited: string[] | null
          has_latex: boolean
          has_code: boolean
          has_diagrams: boolean
          formatted_content: Json | null
          accuracy_rating: number | null
          helpfulness_score: number | null
          clarity_score: number | null
          completeness_score: number | null
          upvotes: number
          downvotes: number
          reports: number
          is_featured: boolean
          is_verified: boolean
          moderation_status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_id: string
          user_id?: string | null
          content: string
          answer_type?: 'ai' | 'human' | 'hybrid'
          confidence_score?: number | null
          claude_model_used?: string | null
          processing_time_ms?: number | null
          tokens_used?: number | null
          reasoning_steps?: Json | null
          sources_cited?: string[] | null
          has_latex?: boolean
          has_code?: boolean
          has_diagrams?: boolean
          formatted_content?: Json | null
          accuracy_rating?: number | null
          helpfulness_score?: number | null
          clarity_score?: number | null
          completeness_score?: number | null
          upvotes?: number
          downvotes?: number
          reports?: number
          is_featured?: boolean
          is_verified?: boolean
          moderation_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          user_id?: string | null
          content?: string
          answer_type?: 'ai' | 'human' | 'hybrid'
          confidence_score?: number | null
          claude_model_used?: string | null
          processing_time_ms?: number | null
          tokens_used?: number | null
          reasoning_steps?: Json | null
          sources_cited?: string[] | null
          has_latex?: boolean
          has_code?: boolean
          has_diagrams?: boolean
          formatted_content?: Json | null
          accuracy_rating?: number | null
          helpfulness_score?: number | null
          clarity_score?: number | null
          completeness_score?: number | null
          upvotes?: number
          downvotes?: number
          reports?: number
          is_featured?: boolean
          is_verified?: boolean
          moderation_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          subject_id: string | null
          session_name: string | null
          session_type: 'tutor' | 'homework_help' | 'test_prep' | 'concept_review'
          status: 'active' | 'paused' | 'completed'
          ai_personality: string
          difficulty_level: string | null
          learning_objectives: string[] | null
          message_count: number
          duration_minutes: number
          concepts_covered: string[] | null
          knowledge_gaps_identified: string[] | null
          started_at: string
          ended_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          session_name?: string | null
          session_type?: 'tutor' | 'homework_help' | 'test_prep' | 'concept_review'
          status?: 'active' | 'paused' | 'completed'
          ai_personality?: string
          difficulty_level?: string | null
          learning_objectives?: string[] | null
          message_count?: number
          duration_minutes?: number
          concepts_covered?: string[] | null
          knowledge_gaps_identified?: string[] | null
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          session_name?: string | null
          session_type?: 'tutor' | 'homework_help' | 'test_prep' | 'concept_review'
          status?: 'active' | 'paused' | 'completed'
          ai_personality?: string
          difficulty_level?: string | null
          learning_objectives?: string[] | null
          message_count?: number
          duration_minutes?: number
          concepts_covered?: string[] | null
          knowledge_gaps_identified?: string[] | null
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          chat_session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          message_type: 'text' | 'image' | 'code' | 'latex' | 'file'
          tokens_used: number | null
          processing_time_ms: number | null
          confidence_score: number | null
          attachments: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          chat_session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          message_type?: 'text' | 'image' | 'code' | 'latex' | 'file'
          tokens_used?: number | null
          processing_time_ms?: number | null
          confidence_score?: number | null
          attachments?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          chat_session_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          message_type?: 'text' | 'image' | 'code' | 'latex' | 'file'
          tokens_used?: number | null
          processing_time_ms?: number | null
          confidence_score?: number | null
          attachments?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          user_uuid: string
          points: number
          reason: string
        }
        Returns: undefined
      }
      check_daily_limit: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
      calculate_user_level: {
        Args: {
          points: number
        }
        Returns: number
      }
      get_user_analytics: {
        Args: {
          user_uuid: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}