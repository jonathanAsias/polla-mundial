-- Partidos definidos por penales: Alemania vs Paraguay (#74) y Países Bajos vs Marruecos (#75)
-- Ejecutar en Supabase SQL Editor

-- Columnas (si aún no existen)
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS winner_side TEXT CHECK (winner_side IN ('home', 'away'));

ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS home_penalties INT,
  ADD COLUMN IF NOT EXISTS away_penalties INT;

ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS fixture_status_short TEXT;

-- #74 Alemania 1-1 Paraguay (3-4 pen.) — gana Paraguay
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

-- #75 Países Bajos 1-1 Marruecos (2-3 pen.) — gana Marruecos
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

-- Recalcular puntos: 1 pt si acertó ganador (Paraguay / Marruecos), 2 pts si marcador exacto 1-1
UPDATE public.predictions p
SET points_earned = (
  CASE
    WHEN p.predicted_home = m.home_score AND p.predicted_away = m.away_score THEN 2
    ELSE 0
  END
  +
  CASE
    WHEN m.winner_side = 'home' AND p.predicted_home > p.predicted_away THEN 1
    WHEN m.winner_side = 'away' AND p.predicted_away > p.predicted_home THEN 1
    ELSE 0
  END
)
FROM public.matches m
WHERE p.match_id = m.id
  AND m.external_id IN (74, 75);

-- Actualizar totales en ranking
UPDATE public.profiles pr
SET total_points = COALESCE(
  (SELECT SUM(points_earned) FROM public.predictions WHERE user_id = pr.id),
  0
);

-- Verificación
SELECT
  m.external_id,
  ht.code AS home,
  at.code AS away,
  m.home_score,
  m.away_score,
  m.home_penalties,
  m.away_penalties,
  m.winner_side,
  m.fixture_status_short,
  m.status
FROM public.matches m
JOIN public.teams ht ON ht.id = m.home_team_id
JOIN public.teams at ON at.id = m.away_team_id
WHERE m.external_id IN (74, 75);
