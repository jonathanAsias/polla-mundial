-- Actualiza el partido 73 (32avos) con los equipos reales según calendario FIFA/Google.
-- Ejecutar en Supabase SQL Editor si el dashboard no muestra Sudáfrica vs Canadá.

UPDATE public.matches
SET
  home_team_id = (SELECT id FROM public.teams WHERE code = 'RSA'),
  away_team_id = (SELECT id FROM public.teams WHERE code = 'CAN')
WHERE external_id = 73;
