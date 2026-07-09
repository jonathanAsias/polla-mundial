-- Propaga ganadores de 32avos (y fases previas) a octavos, cuartos, etc.
-- Ejecutar en Supabase SQL Editor cuando los cruces sigan mostrando "Ganador XX vs Ganador YY".

WITH advancing AS (
  SELECT
    m.external_id,
    CASE
      WHEN m.winner_side = 'home' THEN m.home_team_id
      WHEN m.winner_side = 'away' THEN m.away_team_id
      WHEN m.home_score > m.away_score THEN m.home_team_id
      WHEN m.away_score > m.home_score THEN m.away_team_id
      ELSE NULL
    END AS winner_team_id
  FROM public.matches m
  WHERE m.status = 'finished'
    AND m.home_score IS NOT NULL
    AND m.away_score IS NOT NULL
),
bracket AS (
  SELECT * FROM (VALUES
    (89, 74, 77),
    (90, 73, 75),
    (91, 76, 78),
    (92, 79, 80),
    (93, 83, 84),
    (94, 81, 82),
    (95, 86, 88),
    (96, 85, 87),
    (97, 89, 90),
    (98, 93, 94),
    (99, 91, 92),
    (100, 95, 96),
    (101, 97, 98),
    (102, 99, 100),
    (104, 101, 102)
  ) AS v(target_ext, home_from_ext, away_from_ext)
)
UPDATE public.matches target
SET
  home_team_id = home_adv.winner_team_id,
  away_team_id = away_adv.winner_team_id
FROM bracket b
JOIN advancing home_adv ON home_adv.external_id = b.home_from_ext
JOIN advancing away_adv ON away_adv.external_id = b.away_from_ext
WHERE target.external_id = b.target_ext
  AND home_adv.winner_team_id IS NOT NULL
  AND away_adv.winner_team_id IS NOT NULL
  AND (
    target.home_team_id IS DISTINCT FROM home_adv.winner_team_id
    OR target.away_team_id IS DISTINCT FROM away_adv.winner_team_id
  );

-- Tercer puesto: perdedores de las semifinales (101 y 102)
WITH semifinal AS (
  SELECT
    m.external_id,
    CASE
      WHEN m.winner_side = 'home' THEN m.away_team_id
      WHEN m.winner_side = 'away' THEN m.home_team_id
      WHEN m.home_score > m.away_score THEN m.away_team_id
      WHEN m.away_score > m.home_score THEN m.home_team_id
      ELSE NULL
    END AS loser_team_id
  FROM public.matches m
  WHERE m.status = 'finished'
    AND m.external_id IN (101, 102)
    AND m.home_score IS NOT NULL
    AND m.away_score IS NOT NULL
)
UPDATE public.matches target
SET
  home_team_id = sf101.loser_team_id,
  away_team_id = sf102.loser_team_id
FROM semifinal sf101
JOIN semifinal sf102 ON sf102.external_id = 102
WHERE target.external_id = 103
  AND sf101.external_id = 101
  AND sf101.loser_team_id IS NOT NULL
  AND sf102.loser_team_id IS NOT NULL;

-- Verificación: octavos (89–96) y cuartos (97–100)
SELECT
  m.external_id,
  m.phase,
  ht.code AS home,
  ht.name AS home_name,
  at.code AS away,
  at.name AS away_name,
  m.home_score,
  m.away_score,
  m.winner_side,
  m.status
FROM public.matches m
JOIN public.teams ht ON ht.id = m.home_team_id
JOIN public.teams at ON at.id = m.away_team_id
WHERE m.external_id BETWEEN 89 AND 100
ORDER BY m.external_id;
