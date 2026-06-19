/**
 * Thumbnail Engine - 썸네일 문구 생성
 * 향후 Gemini API 연동 시 이 파일만 수정
 */

const COPY_PATTERNS = [
  '🚨 이거 진짜 혁명입니다',
  '삶의 질 10배 올라가는 치트키',
  '아직도 안 샀다고? 핵인싸 꿀템',
  '쿠팡에서 무조건 사야 되는 품절대란템',
  '대륙의 실수급 꿀템 발견',
  '이거 모르면 손해 보는 아이템',
];

/**
 * 카드 기반 썸네일 CTR 문구 생성
 * @param {Object} card
 * @returns {string[]}
 */
export function generateThumbnailCopy(card) {
  const categoryHook = {
    '리빙/아이디어': '🏠 자취생 필수템 등극',
    '뷰티/패션': '💄 올영 품절 대란템',
    'it/전자기기': '📱 IT덕후들이 극찬한',
    '푸드/레시피': '🍳 요리 고수들의 비밀템',
    '유용한 꿀팁': '💡 알면 이득 보는 꿀팁',
  };

  const hook = categoryHook[card.category] || '🔥 지금 핫한';
  const shortTitle = card.title.substring(0, 12);

  return [
    COPY_PATTERNS[card.id.length % COPY_PATTERNS.length],
    `${hook} ${shortTitle}`,
    `조회수 ${Math.floor(card.viewCount / 10000)}만 돌파 예상`,
    '품절 전에 당장 확인하세요',
  ];
}
