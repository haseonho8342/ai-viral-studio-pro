/**
 * YouTube Shorts Engine - 유튜브 쇼츠 실시간 데이터
 * VITE_YOUTUBE_API_KEY 필수 — 더미/시뮬레이션 사용 안 함
 */

import { calculateCoupangScore } from './coupangEngine';
import { calculateViralScore, formatViewCount, filterAndSortCards } from './viralEngine';
import { getRuntimeEnv } from '../lib/runtimeConfig';

const FETCH_TIMEOUT_MS = 15000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('YouTube API 요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

const CATEGORY_KEYWORDS = {
  '리빙/아이디어': ['리빙', '주방', '정리', '수납', '살림', '자취', '인테리어', '홈'],
  '뷰티/패션': ['뷰티', '피부', '메이크업', '괄사', '올영', '패션'],
  'it/전자기기': ['IT', '스마트폰', '가전', '테크', 'gadget', '전자'],
  '푸드/레시피': ['요리', '레시피', '음식', '에어프라이어', '푸드'],
  '유용한 꿀팁': ['꿀팁', '팁', '생활', '꿀정보'],
};

export function getYouTubeApiKey() {
  return (
    getRuntimeEnv('VITE_YOUTUBE_API_KEY') ||
    localStorage.getItem('youtube_api_key')?.trim() ||
    ''
  );
}

export function isYouTubeApiAvailable() {
  return Boolean(getYouTubeApiKey());
}

function guessCategory(title, tags = []) {
  const text = `${title} ${tags.join(' ')}`.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw.toLowerCase()))) return cat;
  }
  return '리빙/아이디어';
}

const FALLBACK_THUMB =
  'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=500&q=80';

function youtubeThumb(videoId) {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : FALLBACK_THUMB;
}

function calcTrendVelocity(viewCount, likeCount, publishedAt) {
  const hours = Math.max(1, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
  const velocity = Math.round(((viewCount + likeCount * 10) / hours) * 0.1);
  return Math.min(99, Math.max(1, velocity));
}

function mapToViralCard(item, index, { isLive = false, region = 'KR' } = {}) {
  const viewCount = item.viewCount || 0;
  const likeCount = item.likeCount || 0;
  const commentCount = item.commentCount || 0;
  const category = item.category || guessCategory(item.title, item.tags);
  const viralScore = calculateViralScore({ viewCount, likeCount, commentCount });
  const coupangScore = calculateCoupangScore({ category, viralScore });
  const engagementRate = viewCount > 0
    ? Number(((likeCount / viewCount) * 100).toFixed(1))
    : 0;

  return {
    id: item.videoId ? `yt-${item.videoId}` : `yt-live-${index}`,
    rank: index + 1,
    title: item.title,
    thumbnail: item.thumbnail || youtubeThumb(item.videoId),
    category,
    platform: 'YouTube',
    viewCount,
    likeCount,
    commentCount,
    viewCountFormatted: formatViewCount(viewCount),
    viralScore,
    coupangScore,
    creator: item.creator || 'Unknown',
    channelId: item.channelId || '',
    tags: item.tags || [],
    engagementRate,
    sourceUrl: item.videoId
      ? `https://www.youtube.com/shorts/${item.videoId}`
      : 'https://www.youtube.com/shorts',
    publishedAt: item.publishedAt || new Date().toISOString(),
    trendVelocity: item.trendVelocity ?? calcTrendVelocity(viewCount, likeCount, item.publishedAt),
    algorithmScore: viralScore,
    isNew: item.isNew ?? (Date.now() - new Date(item.publishedAt).getTime() < 86400000),
    isLive,
    region,
  };
}

async function fetchFromYouTubeApi(region = 'KR', keyword = 'shorts 꿀템') {
  const apiKey = getYouTubeApiKey();
  if (!apiKey) throw new Error('YouTube API 키가 설정되지 않았습니다. 설정 페이지에서 입력해 주세요.');

  const q = keyword.trim() || 'shorts 꿀템 리빙';
  const searchParams = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    videoDuration: 'short',
    order: 'viewCount',
    regionCode: region,
    relevanceLanguage: region === 'KR' ? 'ko' : 'en',
    q,
    maxResults: '25',
    key: apiKey,
  });

  const searchRes = await fetchWithTimeout(
    `https://www.googleapis.com/youtube/v3/search?${searchParams}`
  );
  if (!searchRes.ok) {
    const err = await searchRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `YouTube API 오류 (${searchRes.status})`);
  }

  const searchData = await searchRes.json();
  const items = searchData.items || [];
  if (items.length === 0) throw new Error('검색 결과가 없습니다.');

  const videoIds = items.map((it) => it.id?.videoId).filter(Boolean).join(',');
  const videoRes = await fetchWithTimeout(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoIds}&key=${apiKey}`
  );
  if (!videoRes.ok) throw new Error('영상 통계 조회 실패');

  const videoData = await videoRes.json();
  const statsMap = Object.fromEntries(
    (videoData.items || []).map((v) => [v.id, v])
  );

  const cards = items.map((item, index) => {
    const videoId = item.id?.videoId;
    const stats = statsMap[videoId]?.statistics || {};
    const snippet = statsMap[videoId]?.snippet || item.snippet;
    const viewCount = parseInt(stats.viewCount || '0', 10);
    const likeCount = parseInt(stats.likeCount || '0', 10);
    const commentCount = parseInt(stats.commentCount || '0', 10);
    const publishedAt = snippet.publishedAt || item.snippet.publishedAt;

    return mapToViralCard(
      {
        videoId,
        title: snippet.title || item.snippet.title,
        thumbnail:
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.high?.url ||
          youtubeThumb(videoId),
        creator: snippet.channelTitle || item.snippet.channelTitle,
        channelId: snippet.channelId || item.snippet.channelId,
        viewCount,
        likeCount,
        commentCount,
        publishedAt,
        tags: snippet.tags?.slice(0, 5) || [],
        isNew: Date.now() - new Date(publishedAt).getTime() < 86400000 * 2,
      },
      index,
      { isLive: true, region }
    );
  });

  return cards.sort((a, b) => b.viralScore - a.viralScore)
    .map((c, idx) => ({ ...c, rank: idx + 1 }));
}

export async function fetchYouTubeShortsFeed({ region = 'KR', keyword = '' } = {}) {
  const cards = await fetchFromYouTubeApi(region, keyword);
  return { cards, source: 'youtube-api', syncedAt: new Date().toISOString() };
}

export function filterYouTubeCards(cards, { search = '', category = '전체', sortBy = 'views' }) {
  return filterAndSortCards(cards, { search, category, sortBy });
}
