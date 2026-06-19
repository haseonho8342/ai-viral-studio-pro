/**
 * Inpock Engine - 인포크 링크 생성
 * 향후 Inpock API 연동 시 이 파일만 수정
 */

/**
 * 카드 기반 인포크 링크 데이터 생성
 * @param {Object} card
 * @param {Array} products - 쿠팡 상품 목록
 * @returns {{title, url, description}}
 */
export function generateInpockLink(card, products = []) {
  const shortName = card.title.substring(0, 20).replace(/\[.*?\]/g, '').trim();
  const productCount = products.length || 2;

  return {
    title: `🧺 [숏폼 바로구매] ${shortName} 링크 모음`,
    url: `https://inpock.link/viral_studio_${card.id}`,
    description: `쿠팡 파트너스 ${productCount}개 상품이 연결된 인포크 링크입니다.`,
  };
}
