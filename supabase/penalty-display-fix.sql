-- Migración completa: mostrar partidos definidos por penales en perfiles y ranking
-- Ejecutar en Supabase SQL Editor (una sola vez)

-- 1. Columnas necesarias
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS winner_side TEXT CHECK (winner_side IN ('home', 'away'));

ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS home_penalties INT,
  ADD COLUMN IF NOT EXISTS away_penalties INT;

ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS fixture_status_short TEXT;

-- 2. Resultados conocidos por penales (32avos, junio 2026)
UPDATE public.matches
SET
  home_score = 1,
  away_score = 1,
  status = 'finished',
  winner_side = 'away',
  home_penalties = 3,
  away_penalties = 4,
  fixture_status_short = 'PEN'
WHERE external_id = 74;

UPDATE public.matches
SET
  home_score = 1,
  away_score = 1,
  status = 'finished',
  winner_side = 'away',
  home_penalties = 2,
  away_penalties = 3,
  fixture_status_short = 'PEN'
WHERE external_id = 75;

-- 3. Cualquier empate en eliminatoria sin metadatos = penales
UPDATE public.matches
SET fixture_status_short = COALESCE(fixture_status_short, 'PEN')
WHERE status = 'finished'
  AND phase <> 'group'
  AND home_score IS NOT NULL
  AND home_score = away_score
  AND fixture_status_short IS NULL;

-- 4. Recalcular puntos tras actualizar winner_side (opcional; la app también lo hace al sincronizar)
-- UPDATE predictions p SET points_earned = ...  -- mejor usar "Sincronizar" en la app
