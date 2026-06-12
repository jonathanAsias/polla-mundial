-- Polla Mundialista 2026 — Database Schema
-- Run this in the Supabase SQL Editor

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT,
  avatar_url    TEXT,
  total_points  INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TEAMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.teams (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  code          TEXT NOT NULL UNIQUE,
  flag_emoji    TEXT,
  group_name    TEXT,
  external_id   INT
);

-- ============================================================
-- MATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.matches (
  id              SERIAL PRIMARY KEY,
  home_team_id    INT NOT NULL REFERENCES public.teams(id),
  away_team_id    INT NOT NULL REFERENCES public.teams(id),
  phase           TEXT NOT NULL CHECK (phase IN ('group', 'r32', 'r16', 'qf', 'sf', 'final')),
  scheduled_at    TIMESTAMPTZ NOT NULL,
  home_score      INT,
  away_score      INT,
  status          TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'finished')),
  external_id     INT UNIQUE,
  venue           TEXT,
  city            TEXT,
  results_updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.app_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_scheduled_at ON public.matches(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_phase ON public.matches(phase);

-- ============================================================
-- PREDICTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.predictions (
  id              SERIAL PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id        INT NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  predicted_home  INT NOT NULL CHECK (predicted_home >= 0 AND predicted_home <= 20),
  predicted_away  INT NOT NULL CHECK (predicted_away >= 0 AND predicted_away <= 20),
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  points_earned   INT NOT NULL DEFAULT 0 CHECK (points_earned >= 0 AND points_earned <= 3),
  UNIQUE(user_id, match_id)
);

CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON public.predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON public.predictions(match_id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Profiles: everyone can read, users can update own profile
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Teams & matches: public read-only
CREATE POLICY "teams_select_all" ON public.teams
  FOR SELECT USING (true);

CREATE POLICY "matches_select_all" ON public.matches
  FOR SELECT USING (true);

-- Predictions: users manage their own
CREATE POLICY "predictions_select_own" ON public.predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.match_accepts_predictions(p_match_id int)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.matches m
    WHERE m.id = p_match_id
      AND m.status = 'upcoming'
      AND NOW() < m.scheduled_at - interval '10 minutes'
  );
$$;

CREATE POLICY "predictions_insert_own" ON public.predictions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND public.match_accepts_predictions(match_id)
  );

CREATE POLICY "predictions_update_own" ON public.predictions
  FOR UPDATE USING (
    auth.uid() = user_id
    AND public.match_accepts_predictions(match_id)
  );

-- Service role bypasses RLS for cron/sync operations
