/**
 * Translate Engine - 중국어 번역 생성
 * 향후 Gemini API 연동 시 이 파일만 수정
 */

const TEMPLATES = [
  '【解压神器】这可能是我今年用过的最聪明的 "{keyword}" 了！实用又好看，赶紧安排起来吧！',
  '【家居好物】这个 "{keyword}" 真的太方便了！懒人必备，强烈推荐给大家～',
  '【酷炫好物】没想到 "{keyword}" 这么好用！生活幸福感瞬间提升！',
];

/**
 * 카드 기반 중국어 번역 텍스트 생성
 * @param {Object} card
 * @returns {string}
 */
export function generateChineseTranslation(card) {
  const keyword = card.tags?.[0] || card.category.split('/')[0] || '好物';
  const template = TEMPLATES[card.id.length % TEMPLATES.length];
  return template.replace('{keyword}', keyword);
}

/**
 * 중국어 해시태그 생성
 */
export function generateChineseKeywords(card) {
  const base = card.tags?.[0] || '好物';
  return [`#${base}`, '#酷炫好物', '#解压神器', '#家居好物推荐'];
}
