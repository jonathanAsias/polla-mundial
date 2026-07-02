-- Estado corto API-Football (FT, AET, PEN) para detectar penales en la UI
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS fixture_status_short TEXT;

-- Empates en eliminatoria = definidos por penales
UPDATE public.matches
SET fixture_status_short = COALESCE(fixture_status_short, 'PEN')
WHERE status = 'finished'
  AND phase <> 'group'
  AND home_score IS NOT NULL
  AND home_score = away_score;
