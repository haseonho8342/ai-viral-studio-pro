/**
 * Dashboard Engine - 실시간 YouTube 데이터 기반 통계 계산
 */

const AI_RECOMMEND_THRESHOLD = 70;
const COUPANG_THRESHOLD = 60;

function isToday(iso) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function extractKeywords(cards, limit = 8) {
  const freq = {};
  cards.forEach((card) => {
    const words = `${card.title} ${(card.tags || []).join(' ')}`
      .replace(/#shorts/gi, '')
      .split(/[\s,#·—\-]+/)
      .filter((w) => w.length >= 2 && w.length <= 12);
    words.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

export function computeDashboardStats(shortsFeed = [], analysisHistory = []) {
  const todayShorts = shortsFeed.filter((c) => isToday(c.publishedAt) || c.isNew);
  const todayAnalyzed = analysisHistory.filter((h) => isToday(h.analyzedAt));
  const aiRecommended = shortsFeed.filter((c) => c.viralScore >= AI_RECOMMEND_THRESHOLD);
  const coupangEligible = shortsFeed.filter((c) => c.coupangScore >= COUPANG_THRESHOLD);
  const chinaCandidates = shortsFeed.filter(
    (c) => c.viralScore >= 60 && ['리빙/아이디어', '뷰티/패션', 'it/전자기기'].includes(c.category)
  );
  const topRising = [...shortsFeed]
    .sort((a, b) => (b.trendVelocity || 0) - (a.trendVelocity || 0))
    .slice(0, 5);
  const trendKeywords = extractKeywords(shortsFeed);
  const recentAnalysis = analysisHistory.slice(0, 5);

  return {
    collectedToday: todayShorts.length || shortsFeed.length,
    analyzedToday: todayAnalyzed.length,
    aiRecommended: aiRecommended.length,
    coupangEligible: coupangEligible.length,
    chinaCandidates: chinaCandidates.length,
    totalShorts: shortsFeed.length,
    trendKeywords,
    topRising,
    recentAnalysis,
    aiRecommendedList: aiRecommended.slice(0, 6),
  };
}
