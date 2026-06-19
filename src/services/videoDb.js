/**
 * Supabase videos / analysis 테이블 CRUD
 */
import { getSupabase } from '../lib/supabaseClient';
import { initSupabaseSession } from './supabaseDb';

async function getUserId() {
  await initSupabaseSession();
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

/** 영상 메타 저장 */
export async function saveVideo(video) {
  const supabase = getSupabase();
  const userId = await getUserId();
  if (!supabase || !userId) return null;

  const { data, error } = await supabase
    .from('videos')
    .upsert(
      {
        user_id: userId,
        video_id: video.videoId,
        title: video.title,
        channel: video.channel,
        thumbnail: video.thumbnail,
        url: video.url,
        view_count: video.viewCount || 0,
        duration: video.duration,
        published_at: video.publishedAt,
      },
      { onConflict: 'user_id,video_id' }
    )
    .select()
    .single();

  if (error) {
    console.warn('[videoDb] saveVideo:', error.message);
    return null;
  }
  return data;
}

/** AI 분석 결과 저장 */
export async function saveAnalysis(videoId, result) {
  const supabase = getSupabase();
  const userId = await getUserId();
  if (!supabase || !userId) return null;

  const { data, error } = await supabase
    .from('analysis')
    .insert({
      user_id: userId,
      video_id: videoId,
      subtitle: result.subtitle || '',
      summary: result.summary || '',
      keywords: result.keywords || '',
      study_note: result.studyNote || '',
      blog_summary: result.blogSummary || '',
      three_line_summary: result.threeLineSummary || '',
      important_sentences: result.importantSentences || '',
      korean_translation: result.koreanTranslation || '',
    })
    .select()
    .single();

  if (error) {
    console.warn('[videoDb] saveAnalysis:', error.message);
    return null;
  }
  return data;
}

/** 최근 영상 목록 */
export async function fetchRecentVideos(limit = 20) {
  const supabase = getSupabase();
  const userId = await getUserId();
  if (!supabase || !userId) return [];

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[videoDb] fetchRecentVideos:', error.message);
    return [];
  }
  return data || [];
}

/** 최근 AI 분석 목록 */
export async function fetchRecentAnalysis(limit = 20) {
  const supabase = getSupabase();
  const userId = await getUserId();
  if (!supabase || !userId) return [];

  const { data, error } = await supabase
    .from('analysis')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[videoDb] fetchRecentAnalysis:', error.message);
    return [];
  }
  return data || [];
}

/** 히스토리 검색 */
export async function searchVideoHistory(query) {
  const videos = await fetchRecentVideos(50);
  if (!query?.trim()) return videos;
  const q = query.toLowerCase();
  return videos.filter(
    (v) =>
      v.title?.toLowerCase().includes(q) ||
      v.channel?.toLowerCase().includes(q) ||
      v.video_id?.includes(q)
  );
}
