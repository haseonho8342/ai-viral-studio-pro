-- AI Viral Studio PRO v5 — 유튜브 분석·다운로드 플랫폼
-- Supabase SQL Editor에서 실행

CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id text NOT NULL,
  title text,
  channel text,
  thumbnail text,
  url text,
  view_count bigint DEFAULT 0,
  duration text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS public.analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id text NOT NULL,
  subtitle text,
  summary text,
  keywords text,
  study_note text,
  blog_summary text,
  three_line_summary text,
  important_sentences text,
  korean_translation text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_videos_user_created ON public.videos (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_user_created ON public.analysis (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_video ON public.analysis (user_id, video_id);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "videos_select_own" ON public.videos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "videos_insert_own" ON public.videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "videos_update_own" ON public.videos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "videos_delete_own" ON public.videos FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "analysis_select_own" ON public.analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "analysis_insert_own" ON public.analysis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "analysis_update_own" ON public.analysis FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "analysis_delete_own" ON public.analysis FOR DELETE USING (auth.uid() = user_id);
