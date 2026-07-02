-- Marcador de penales (desde API-Football score.penalty)
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS home_penalties INT,
  ADD COLUMN IF NOT EXISTS away_penalties INT;
