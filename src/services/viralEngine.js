/**
 * Viral Engine - 바이럴 점수 계산 및 카드 데이터 처리
 */

/**
 * viralScore = (viewCount × 0.5) × (likeCount × 0.3) × (commentCount × 0.2)
 * 정규화하여 0~100 스케일로 반환
 */
export function calculateViralScore({ viewCount = 0, likeCount = 0, commentCount = 0 }) {
  const v = Math.max(viewCount, 1);
  const l = Math.max(likeCount, 1);
  const c = Math.max(commentCount, 1);
  const raw = (v * 0.5) * (l * 0.3) * (c * 0.2);
  const normalized = Math.log10(raw + 1) * 12;
  return Math.min(100, Math.max(1, Math.round(normalized)));
}

export function enrichCardsWithViralScore(cards) {
  return cards.map((card) => ({
    ...card,
    viralScore: calculateViralScore({
      viewCount: card.viewCount,
      likeCount: card.likeCount,
      commentCount: card.commentCount,
    }),
  }));
}

export function filterAndSortCards(cards, { search = '', category = '전체', sortBy = 'viral' }) {
  let result = [...cards];

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.creator && c.creator.toLowerCase().includes(q))
    );
  }

  if (category !== '전체') {
    result = result.filter((c) => c.category === category);
  }

  switch (sortBy) {
    case 'views':
    case 'realtime':
      result.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case 'likes':
      result.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      break;
    case 'latest':
      result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      break;
    case 'recommended':
      result.sort((a, b) => b.viralScore - a.viralScore);
      break;
    case 'today':
      result = result.filter((c) => c.viralScore > 70).sort((a, b) => b.coupangScore - a.coupangScore);
      break;
    case 'thisWeek':
      result.sort((a, b) => b.coupangScore - a.coupangScore);
      break;
    case 'thisMonth':
      result.sort((a, b) => b.viewCount + b.viralScore - (a.viewCount + a.viralScore));
      break;
    case 'viral':
    default:
      result.sort((a, b) => b.viralScore - a.viralScore);
  }

  return result;
}

export function formatViewCount(count) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${Math.floor(count / 1000)}K`;
  return String(count);
}

export function formatLikeCount(count) {
  if (count >= 10000) return `${(count / 1000).toFixed(1)}K`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count || 0);
}
