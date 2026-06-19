-- AI Viral Studio PRO — Supabase 초기 스키마
-- Supabase Dashboard → SQL Editor 에서 실행하세요.
-- Authentication → Providers → Anonymous sign-ins 활성화 필요

-- 사용자 설정
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  script_tone text NOT NULL DEFAULT 'aggressive',
  shorts_region text NOT NULL DEFAULT 'KR',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 분석 히스토리
CREATE TABLE IF NOT EXISTS public.analysis_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id text NOT NULL,
  title text,
  thumbnail text,
  analyzed_at timestamptz NOT NULL DEFAULT now(),
  viral_score numeric,
  analysis_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, card_id)
);

CREATE INDEX IF NOT EXISTS idx_analysis_history_user_analyzed
  ON public.analysis_history (user_id, analyzed_at DESC);

-- 저장한 쇼츠
CREATE TABLE IF NOT EXISTS public.saved_shorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id text NOT NULL,
  card_json jsonb NOT NULL,
  saved_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, card_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_shorts_user_saved
  ON public.saved_shorts (user_id, saved_at DESC);

-- RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_shorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_settings_select_own" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_settings_insert_own" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_settings_update_own" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "analysis_history_select_own" ON public.analysis_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "analysis_history_insert_own" ON public.analysis_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "analysis_history_update_own" ON public.analysis_history
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "analysis_history_delete_own" ON public.analysis_history
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "saved_shorts_select_own" ON public.saved_shorts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_shorts_insert_own" ON public.saved_shorts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_shorts_update_own" ON public.saved_shorts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "saved_shorts_delete_own" ON public.saved_shorts
  FOR DELETE USING (auth.uid() = user_id);
