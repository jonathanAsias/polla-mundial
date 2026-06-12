-- Ejecutar en Supabase SQL Editor

ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS results_updated_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS public.app_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
