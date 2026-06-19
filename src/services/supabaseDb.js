import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient';

const HISTORY_KEY = 'avs_analysis_history_v4';
const MAX_HISTORY = 50;

function mapRowToHistory(row) {
  return {
    cardId: row.card_id,
    title: row.title,
    thumbnail: row.thumbnail,
    analyzedAt: row.analyzed_at,
    viralScore: row.viral_score,
  };
}

function loadLocalHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalHistory(entry) {
  const history = loadLocalHistory();
  const filtered = history.filter((h) => h.cardId !== entry.cardId);
  const updated = [entry, ...filtered].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function isSupabaseEnabled() {
  return isSupabaseConfigured();
}

export async function initSupabaseSession() {
  const supabase = getSupabase();
  if (!supabase) return { connected: false, userId: null };

  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session?.user) {
    return { connected: true, userId: sessionData.session.user.id };
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.warn('[Supabase] anonymous sign-in failed:', error.message);
    return { connected: false, userId: null, error: error.message };
  }

  return { connected: true, userId: data.user?.id ?? null };
}

export async function fetchAnalysisHistory() {
  const supabase = getSupabase();
  if (!supabase) return loadLocalHistory();

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) return loadLocalHistory();

  const { data, error } = await supabase
    .from('analysis_history')
    .select('card_id, title, thumbnail, analyzed_at, viral_score')
    .eq('user_id', userId)
    .order('analyzed_at', { ascending: false })
    .limit(MAX_HISTORY);

  if (error) {
    console.warn('[Supabase] fetch history failed:', error.message);
    return loadLocalHistory();
  }

  return (data || []).map(mapRowToHistory);
}

export async function upsertAnalysisHistory(entry, analysis = null) {
  const localUpdated = saveLocalHistory(entry);
  const supabase = getSupabase();
  if (!supabase) return localUpdated;

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) return localUpdated;

  const { error } = await supabase.from('analysis_history').upsert(
    {
      user_id: userId,
      card_id: entry.cardId,
      title: entry.title,
      thumbnail: entry.thumbnail,
      analyzed_at: entry.analyzedAt,
      viral_score: entry.viralScore,
      analysis_json: analysis || null,
    },
    { onConflict: 'user_id,card_id' }
  );

  if (error) {
    console.warn('[Supabase] upsert history failed:', error.message);
    return localUpdated;
  }

  return fetchAnalysisHistory();
}

export async function fetchUserSettings() {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from('user_settings')
    .select('script_tone, shorts_region')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[Supabase] fetch settings failed:', error.message);
    return null;
  }

  return data;
}

export async function upsertUserSettings({ scriptTone, shortsRegion }) {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) return false;

  const { error } = await supabase.from('user_settings').upsert(
    {
      user_id: userId,
      script_tone: scriptTone,
      shorts_region: shortsRegion,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    console.warn('[Supabase] upsert settings failed:', error.message);
    return false;
  }

  return true;
}

export async function getSupabaseStatus() {
  if (!isSupabaseConfigured()) {
    return { enabled: false, connected: false, message: '환경 변수 미설정' };
  }

  const supabase = getSupabase();
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;

  if (!userId) {
    const session = await initSupabaseSession();
    return {
      enabled: true,
      connected: session.connected,
      userId: session.userId,
      message: session.connected ? '익명 세션 연결됨' : session.error || '연결 실패',
    };
  }

  return {
    enabled: true,
    connected: true,
    userId,
    message: 'DB 연결됨',
  };
}
