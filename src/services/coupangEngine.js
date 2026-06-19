/**
 * Coupang Engine - 쿠팡 파트너스 추천 상품 생성
 * 향후 Coupang Partners API 연동 시 이 파일만 수정
 */

const PRICE_TIERS = [
  { min: 10000, max: 19900, label: '12,800원' },
  { min: 20000, max: 29900, label: '24,900원' },
  { min: 30000, max: 49900, label: '34,500원' },
  { min: 50000, max: 99999, label: '58,900원' },
];

function getPriceByScore(score) {
  const tier = PRICE_TIERS.find((t) => score >= t.min && score <= t.max) || PRICE_TIERS[1];
  return tier.label;
}

function cleanProductName(title) {
  return title.replace(/\[.*?\]/g, '').substring(0, 18).trim() || '바이럴 추천템';
}

/**
 * 카드 기반 쿠팡 추천 상품 목록 생성
 * @param {Object} card
 * @returns {Array<{name, price, commission, link}>}
 */
export function generateCoupangProducts(card) {
  const productName = cleanProductName(card.title);
  const basePrice = getPriceByScore(card.coupangScore * 300);

  return [
    {
      name: `🔥 실시간 1위 [공식] ${productName} 프리미엄 패키지`,
      price: basePrice,
      commission: '파트너스 수수료 3% (예상 747원/건)',
      link: `https://link.coupang.com/a/viral-${card.id}-premium`,
    },
    {
      name: `✨ 가성비형 [당일발송] ${productName} 호환 모델`,
      price: '12,800원',
      commission: '파트너스 수수료 3% (예상 384원/건)',
      link: `https://link.coupang.com/a/viral-${card.id}-budget`,
    },
  ];
}

/**
 * 쿠팡 적합도 점수 계산
 */
export function calculateCoupangScore({ category, viralScore }) {
  const categoryWeight = {
    '리빙/아이디어': 1.05,
    '뷰티/패션': 0.98,
    'it/전자기기': 1.02,
    '푸드/레시피': 0.92,
    '유용한 꿀팁': 0.95,
  };
  const weight = categoryWeight[category] || 1;
  return Math.min(100, Math.max(50, Math.round(viralScore * weight)));
}
