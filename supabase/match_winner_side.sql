-- Ganador en penales / alargue (marcador puede quedar empatado)
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS winner_side TEXT CHECK (winner_side IN ('home', 'away'));

COMMENT ON COLUMN public.matches.winner_side IS
  'Ganador del partido cuando el marcador está empatado (p. ej. penales). home o away.';
