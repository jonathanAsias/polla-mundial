-- Resultados oficiales FIFA / calendario Google — 32avos, octavos y cuartos
-- Fuentes: fifa.com, Sporting News, Yahoo Sports (actualizado 9 jul 2026)
-- Ejecutar en Supabase SQL Editor

ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS winner_side TEXT CHECK (winner_side IN ('home', 'away'));
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS home_penalties INT,
  ADD COLUMN IF NOT EXISTS away_penalties INT;
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS fixture_status_short TEXT;

-- ── 32avos de final (73–88) ────────────────────────────────────────────────
UPDATE public.matches SET home_score = 0, away_score = 1, status = 'finished', winner_side = 'away',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 73; -- CAN 1-0 RSA

UPDATE public.matches SET home_score = 1, away_score = 1, status = 'finished', winner_side = 'away',
  home_penalties = 3, away_penalties = 4, fixture_status_short = 'PEN'
WHERE external_id = 74; -- PAR gana 4-3 pen. a GER

UPDATE public.matches SET home_score = 1, away_score = 1, status = 'finished', winner_side = 'away',
  home_penalties = 2, away_penalties = 3, fixture_status_short = 'PEN'
WHERE external_id = 75; -- MAR gana 3-2 pen. a NED

UPDATE public.matches SET home_score = 2, away_score = 1, status = 'finished', winner_side = 'home',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 76; -- BRA 2-1 JPN

UPDATE public.matches SET home_score = 3, away_score = 0, status = 'finished', winner_side = 'home',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 77; -- FRA 3-0 SWE

UPDATE public.matches SET home_score = 1, away_score = 2, status = 'finished', winner_side = 'away',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 78; -- NOR 2-1 CIV

UPDATE public.matches SET home_score = 2, away_score = 0, status = 'finished', winner_side = 'home',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 79; -- MEX 2-0 ECU

UPDATE public.matches SET home_score = 2, away_score = 1, status = 'finished', winner_side = 'home',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 80; -- ENG 2-1 COD

UPDATE public.matches SET home_score = 3, away_score = 0, status = 'finished', winner_side = 'home',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 81; -- USA 3-0 BIH

UPDATE public.matches SET home_score = 3, away_score = 2, status = 'finished', winner_side = 'home',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'AET'
WHERE external_id = 82; -- BEL 3-2 SEN (prórroga)

UPDATE public.matches SET home_score = 2, away_score = 1, status = 'finished', winner_side = 'home',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 83; -- POR 2-1 CRO

UPDATE public.matches SET home_score = 3, away_score = 0, status = 'finished', winner_side = 'home',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 84; -- ESP 3-0 AUT

UPDATE public.matches SET home_score = 2, away_score = 0, status = 'finished', winner_side = 'home',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 85; -- SUI 2-0 ALG

UPDATE public.matches SET home_score = 3, away_score = 2, status = 'finished', winner_side = 'home',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'AET'
WHERE external_id = 86; -- ARG 3-2 CPV (prórroga)

UPDATE public.matches SET home_score = 1, away_score = 0, status = 'finished', winner_side = 'home',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 87; -- COL 1-0 GHA

UPDATE public.matches SET home_score = 1, away_score = 1, status = 'finished', winner_side = 'away',
  home_penalties = 2, away_penalties = 4, fixture_status_short = 'PEN'
WHERE external_id = 88; -- EGY gana 4-2 pen. a AUS

-- ── Equipos en octavos (ganadores 32avos) ─────────────────────────────────
UPDATE public.matches AS m SET home_team_id = h.id, away_team_id = a.id
FROM (VALUES
  (89, 'PAR', 'FRA'),
  (90, 'CAN', 'MAR'),
  (91, 'BRA', 'NOR'),
  (92, 'MEX', 'ENG'),
  (93, 'POR', 'ESP'),
  (94, 'USA', 'BEL'),
  (95, 'ARG', 'EGY'),
  (96, 'SUI', 'COL')
) AS v(ext, home_code, away_code)
JOIN public.teams h ON h.code = v.home_code
JOIN public.teams a ON a.code = v.away_code
WHERE m.external_id = v.ext;

-- ── Octavos de final (89–96) — 4–7 jul ─────────────────────────────────────
UPDATE public.matches SET home_score = 0, away_score = 1, status = 'finished', winner_side = 'away',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 89; -- FRA 1-0 PAR

UPDATE public.matches SET home_score = 0, away_score = 3, status = 'finished', winner_side = 'away',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 90; -- MAR 3-0 CAN

UPDATE public.matches SET home_score = 1, away_score = 2, status = 'finished', winner_side = 'away',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 91; -- NOR 2-1 BRA

UPDATE public.matches SET home_score = 2, away_score = 3, status = 'finished', winner_side = 'away',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 92; -- ENG 3-2 MEX

UPDATE public.matches SET home_score = 0, away_score = 1, status = 'finished', winner_side = 'away',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 93; -- ESP 1-0 POR

UPDATE public.matches SET home_score = 1, away_score = 4, status = 'finished', winner_side = 'away',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 94; -- BEL 4-1 USA

UPDATE public.matches SET home_score = 3, away_score = 2, status = 'finished', winner_side = 'home',
  home_penalties = NULL, away_penalties = NULL, fixture_status_short = 'FT'
WHERE external_id = 95; -- ARG 3-2 EGY

UPDATE public.matches SET home_score = 0, away_score = 0, status = 'finished', winner_side = 'home',
  home_penalties = 4, away_penalties = 3, fixture_status_short = 'PEN'
WHERE external_id = 96; -- SUI 0-0 COL (4-3 pen.)

-- ── Cuartos de final (97–100) — equipos confirmados FIFA ───────────────────
UPDATE public.matches AS m SET home_team_id = h.id, away_team_id = a.id
FROM (VALUES
  (97, 'FRA', 'MAR'),  -- jue 9 jul, Gillette
  (98, 'ESP', 'BEL'),  -- vie 10 jul, SoFi
  (99, 'NOR', 'ENG'),  -- sáb 11 jul, Miami
  (100, 'ARG', 'SUI')  -- sáb 11 jul, Kansas City
) AS v(ext, home_code, away_code)
JOIN public.teams h ON h.code = v.home_code
JOIN public.teams a ON a.code = v.away_code
WHERE m.external_id = v.ext;

-- ── Recalcular puntos (partidos 73–96) ─────────────────────────────────────
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
  AND m.external_id BETWEEN 73 AND 96
  AND m.status = 'finished';

UPDATE public.profiles pr
SET total_points = COALESCE(
  (SELECT SUM(points_earned) FROM public.predictions WHERE user_id = pr.id),
  0
);

-- ── Verificación vs cuadro FIFA ────────────────────────────────────────────
SELECT
  m.external_id,
  m.phase,
  ht.code || ' vs ' || at.code AS cruce,
  m.home_score || '-' || m.away_score AS resultado,
  m.winner_side,
  m.status
FROM public.matches m
JOIN public.teams ht ON ht.id = m.home_team_id
JOIN public.teams at ON at.id = m.away_team_id
WHERE m.external_id BETWEEN 89 AND 100
ORDER BY m.external_id;
