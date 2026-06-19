/**
 * Xiaohongshu Engine - 샤오홍슈 검색어 생성
 * 향후 Gemini API 연동 시 이 파일만 수정
 */

const XHS_SUFFIXES = ['推荐', '测评', '好物分享', '必买清单', '懒人神器'];

/**
 * 카드 기반 샤오홍슈 SEO 검색어 생성
 * @param {Object} card
 * @returns {string[]}
 */
export function generateXiaohongshuKeywords(card) {
  const base = card.tags?.[0] || card.category.split('/')[0] || '好物';
  const keywords = XHS_SUFFIXES.map((suffix, i) => {
    if (i === 0) return `${base}${suffix}`;
    if (i === 1) return `${base}真实测评`;
    return suffix;
  });
  return [...new Set(keywords)].slice(0, 5);
}
