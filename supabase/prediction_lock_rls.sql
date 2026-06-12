-- Ejecutar en Supabase SQL Editor
-- Bloquea insert/update de predicciones 10 min antes del partido

CREATE OR REPLACE FUNCTION public.match_accepts_predictions(p_match_id int)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.matches m
    WHERE m.id = p_match_id
      AND m.status = 'upcoming'
      AND NOW() < m.scheduled_at - interval '10 minutes'
  );
$$;

DROP POLICY IF EXISTS "predictions_insert_own" ON public.predictions;
CREATE POLICY "predictions_insert_own" ON public.predictions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND public.match_accepts_predictions(match_id)
  );

DROP POLICY IF EXISTS "predictions_update_own" ON public.predictions;
CREATE POLICY "predictions_update_own" ON public.predictions
  FOR UPDATE USING (
    auth.uid() = user_id
    AND public.match_accepts_predictions(match_id)
  );
