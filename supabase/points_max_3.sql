-- Ejecutar en Supabase si el CHECK antiguo limitaba a 2 puntos por partido
ALTER TABLE public.predictions
  DROP CONSTRAINT IF EXISTS predictions_points_earned_check;

ALTER TABLE public.predictions
  ADD CONSTRAINT predictions_points_earned_check
  CHECK (points_earned >= 0 AND points_earned <= 3);
