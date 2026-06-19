/**
 * Script Engine - 30초/60초 쇼츠 대본 생성
 * 향후 Gemini API 연동 시 이 파일만 수정
 */

const TONE_OPENINGS = {
  aggressive: '아직도 구식으로 사세요? 삶의 질 수직 상승하는 이 물건, 직접 써봤습니다.',
  friendly: '안녕하세요! 매일 똑같은 살림에 지치지 않으셨나요? 진짜 쓰기 편한 꿀템 발견했어요!',
  humor: '누가 요즘 물건을 이렇게 써요? 뇌절인 줄 알고 샀다가 통장 털리게 만든 장본인 데려왔습니다.',
};

const TONE_CLOSINGS = {
  aggressive: '고정댓글 링크에서 최저가로 바로 가져가세요!',
  friendly: '관심 있는 분들은 아래 고정 링크를 서둘러 확인해 주세요!',
  humor: '일단 지르고 생각합시다. 월급 삭제 버튼은 아래 본문에 주소 남겨놓을게요!',
};

/**
 * 30초 쇼츠 대본 생성
 */
export function generate30sScript(card, tone = 'aggressive') {
  const opening = TONE_OPENINGS[tone] || TONE_OPENINGS.aggressive;
  const closing = TONE_CLOSINGS[tone] || TONE_CLOSINGS.aggressive;
  const product = card.title.substring(0, 15);

  return `[00:00] (오프닝: 강렬한 시각적 임팩트)
"${opening}"

[00:10] (핵심 사용법 시연)
"버튼 하나만 쓱 누르면 알아서 작동하는 거 보이시죠? ${product} 같은 바쁜 현대인한테 완전 딱입니다."

[00:20] (차별점 강조)
"소재도 탄탄하고, 충전식이라 건전지 걱정 없어요. 인테리어마저 완성해 주는 미친 디자인."

[00:30] (아웃트로)
"이거 하나로 일주일이 편해집니다. ${closing}"`;
}

/**
 * 60초 쇼츠 대본 생성
 */
export function generate60sScript(card, tone = 'aggressive') {
  const opening = TONE_OPENINGS[tone] || TONE_OPENINGS.aggressive;
  const closing = TONE_CLOSINGS[tone] || TONE_CLOSINGS.aggressive;
  const product = card.title.substring(0, 15);

  return `[00:00] (도입부)
"${opening}"

[00:15] (비포&애프터 비교)
"비포 상태 보세요. 좁고 지저분하고 번거롭기 짝이 없죠? ${product} 설치하는 순간 100% 바뀝니다."

[00:35] (리얼 후기 연출)
"실제 구매 평점 4.9 기록할 정도로 만족도가 높아요. 자취방이나 좁은 주방 어디든 찰떡입니다."

[00:48] (스펙 정리)
"인기 대란이라 벌쨈 3차 품절 임박! 한 번 사두면 5년은 고장 없이 스마트하게 씁니다."

[00:55] (클로징)
"오늘 하루만 한정 특가! ${closing}"`;
}

/**
 * 카드 전체 분석용 대본 세트 생성
 */
export function generateScripts(card, tone = 'aggressive') {
  return {
    script30s: generate30sScript(card, tone),
    script60s: generate60sScript(card, tone),
  };
}
