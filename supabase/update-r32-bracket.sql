-- Cuadro oficial 32avos de final — Mundial 2026
-- Ejecutar en Supabase SQL Editor (urgente si no aparecen los cruces eliminatorios).

UPDATE public.matches AS m SET
  home_team_id = h.id,
  away_team_id = a.id
FROM (VALUES
  (73, 'RSA', 'CAN'),
  (74, 'GER', 'PAR'),
  (76, 'BRA', 'JPN'),
  (75, 'NED', 'MAR'),
  (78, 'CIV', 'NOR'),
  (77, 'FRA', 'SWE'),
  (79, 'MEX', 'ECU'),
  (80, 'ENG', 'COD'),
  (82, 'BEL', 'SEN'),
  (81, 'USA', 'BIH'),
  (84, 'ESP', 'AUT'),
  (83, 'POR', 'CRO'),
  (85, 'SUI', 'ALG'),
  (88, 'AUS', 'EGY'),
  (86, 'ARG', 'CPV'),
  (87, 'COL', 'GHA')
) AS v(ext, home_code, away_code)
JOIN public.teams h ON h.code = v.home_code
JOIN public.teams a ON a.code = v.away_code
WHERE m.external_id = v.ext;
