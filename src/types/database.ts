export type MatchPhase =
  | "group"
  | "r32"
  | "r16"
  | "qf"
  | "sf"
  | "final";

export type MatchStatus = "upcoming" | "live" | "finished";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  total_points: number;
  created_at: string;
}

export interface Team {
  id: number;
  name: string;
  code: string;
  flag_emoji: string | null;
  group_name: string | null;
  external_id: number | null;
}

export interface Match {
  id: number;
  home_team_id: number;
  away_team_id: number;
  phase: MatchPhase;
  scheduled_at: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  external_id: number | null;
  venue: string | null;
  city: string | null;
  results_updated_at: string | null;
}

export interface Prediction {
  id: number;
  user_id: string;
  match_id: number;
  predicted_home: number;
  predicted_away: number;
  submitted_at: string;
  points_earned: number;
}

export interface Database {
  public: {
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "total_points"> & {
          total_points?: number;
          created_at?: string;
        };
        Update: Partial<Omit<Profile, "id">>;
        Relationships: [];
      };
      teams: {
        Row: Team;
        Insert: Omit<Team, "id"> & { id?: number };
        Update: Partial<Omit<Team, "id">>;
        Relationships: [];
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, "id" | "status"> & {
          id?: number;
          status?: MatchStatus;
        };
        Update: Partial<Omit<Match, "id">>;
        Relationships: [];
      };
      predictions: {
        Row: Prediction;
        Insert: Omit<Prediction, "id" | "submitted_at" | "points_earned"> & {
          id?: number;
          submitted_at?: string;
          points_earned?: number;
        };
        Update: Partial<Omit<Prediction, "id">>;
        Relationships: [];
      };
    };
  };
}
