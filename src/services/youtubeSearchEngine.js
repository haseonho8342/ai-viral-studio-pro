/**
 * YouTube Data API v3 — 검색·상세 조회
 */
import { getRuntimeEnv } from '../lib/runtimeConfig';

const FETCH_TIMEOUT = 15000;

/** ISO 8601 duration → "3:45" 형식 */
export function formatDuration(iso) {
  if (!iso) return '--:--';
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return iso;
  const h = parseInt(m[1] || '0', 10);
  const min = parseInt(m[2] || '0', 10);
  const s = parseInt(m[3] || '0', 10);
  if (h > 0) return `${h}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${min}:${String(s).padStart(2, '0')}`;
}

export function getYouTubeApiKey() {
  return (
    getRuntimeEnv('VITE_YOUTUBE_API_KEY') ||
    localStorage.getItem('youtube_api_key')?.trim() ||
    ''
  );
}

async function fetchWithTimeout(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}

/** 검색어로 YouTube 영상 검색 */
export async function searchYouTubeVideos(query, maxResults = 20) {
  const key = getYouTubeApiKey();
  if (!key) throw new Error('YouTube API 키가 설정되지 않았습니다. 설정 페이지에서 입력하세요.');

  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    q: query.trim(),
    maxResults: String(maxResults),
    key,
  });

  const searchRes = await fetchWithTimeout(
    `https://www.googleapis.com/youtube/v3/search?${params}`
  );
  if (!searchRes.ok) {
    const err = await searchRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `YouTube 검색 오류 (${searchRes.status})`);
  }

  const searchData = await searchRes.json();
  const items = searchData.items || [];
  if (!items.length) return [];

  const ids = items.map((i) => i.id?.videoId).filter(Boolean).join(',');
  const detailRes = await fetchWithTimeout(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids}&key=${key}`
  );
  if (!detailRes.ok) throw new Error('영상 상세 정보 조회 실패');

  const detailData = await detailRes.json();
  const map = Object.fromEntries((detailData.items || []).map((v) => [v.id, v]));

  return items.map((item) => {
    const vid = item.id?.videoId;
    const d = map[vid] || {};
    const sn = d.snippet || item.snippet;
    const st = d.statistics || {};
    return {
      videoId: vid,
      title: sn.title,
      channel: sn.channelTitle,
      thumbnail: sn.thumbnails?.high?.url || sn.thumbnails?.medium?.url || '',
      viewCount: parseInt(st.viewCount || '0', 10),
      viewCountFormatted: formatViewCount(parseInt(st.viewCount || '0', 10)),
      publishedAt: sn.publishedAt,
      duration: formatDuration(d.contentDetails?.duration),
      url: `https://www.youtube.com/watch?v=${vid}`,
    };
  });
}

/** 단일 영상 상세 */
export async function fetchVideoDetail(videoId) {
  const key = getYouTubeApiKey();
  if (!key) throw new Error('YouTube API 키가 설정되지 않았습니다.');

  const res = await fetchWithTimeout(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${key}`
  );
  if (!res.ok) throw new Error('영상 정보를 불러올 수 없습니다.');

  const data = await res.json();
  const v = data.items?.[0];
  if (!v) throw new Error('영상을 찾을 수 없습니다.');

  const sn = v.snippet;
  const st = v.statistics || {};
  return {
    videoId: v.id,
    title: sn.title,
    description: sn.description,
    channel: sn.channelTitle,
    channelId: sn.channelId,
    thumbnail: sn.thumbnails?.maxres?.url || sn.thumbnails?.high?.url || '',
    tags: sn.tags || [],
    viewCount: parseInt(st.viewCount || '0', 10),
    likeCount: parseInt(st.likeCount || '0', 10),
    commentCount: parseInt(st.commentCount || '0', 10),
    publishedAt: sn.publishedAt,
    duration: formatDuration(v.contentDetails?.duration),
    url: `https://www.youtube.com/watch?v=${v.id}`,
  };
}

function formatViewCount(n) {
  if (n >= 1e8) return `${(n / 1e8).toFixed(1)}억`;
  if (n >= 1e4) return `${(n / 1e4).toFixed(1)}만`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}천`;
  return String(n);
}
