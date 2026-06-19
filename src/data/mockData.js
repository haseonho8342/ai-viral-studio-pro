/**
 * mockData.js - 바이럴 TOP50 더미 데이터
 * API 연결 전 개발/테스트용 데이터 소스
 */

import { calculateCoupangScore } from '../services/coupangEngine';
import { calculateViralScore, formatViewCount } from '../services/viralEngine';

export const CATEGORIES = [
  '전체',
  '리빙/아이디어',
  '뷰티/패션',
  'it/전자기기',
  '푸드/레시피',
  '유용한 꿀팁',
];

export const SORT_OPTIONS = [
  { id: 'recommended', label: '추천순' },
  { id: 'realtime', label: '실시간' },
  { id: 'today', label: '오늘' },
  { id: 'thisWeek', label: '이번주' },
  { id: 'thisMonth', label: '이번달' },
];

const BASE_CARDS = [
  {
    title: '스스로 봉투를 묶고 밀봉하는 스마트 쓰레기통 원리 및 실사용기',
    category: '리빙/아이디어',
    platform: 'TikTok',
    viewCount: 2400000,
    thumbnail: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=500&q=80',
    creator: 'IdeaSpot',
    tags: ['스마트홈', '리빙꿀템', '자동쓰레기통'],
    engagementRate: 8.4,
  },
  {
    title: '스마트폰 사진 바로 뽑는 휴대용 미니 잉크리스 프린터 리뷰',
    category: 'it/전자기기',
    platform: 'TikTok',
    viewCount: 1900000,
    thumbnail: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=500&q=80',
    creator: 'TechGadgetKR',
    tags: ['미니프린터', 'it템', '다이어리꾸미기'],
    engagementRate: 7.9,
  },
  {
    title: '붙이기만 하면 끝! 옷장 속 어둠을 밝혀주는 무선 모션 감지 LED 바',
    category: '리빙/아이디어',
    platform: 'YouTube',
    viewCount: 3100000,
    thumbnail: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=500&q=80',
    creator: '하우스해킹',
    tags: ['센서등', '인테리어', '옷장조명'],
    engagementRate: 9.2,
  },
  {
    title: '360도 회전하는 주방용 화장대용 만능 수납 트레이 정리 쾌감',
    category: '리빙/아이디어',
    platform: 'TikTok',
    viewCount: 1200000,
    thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80',
    creator: 'CleanTok',
    tags: ['회전정리대', '주방수납', '정리습관'],
    engagementRate: 6.5,
  },
  {
    title: '스마트폰을 공중에 띄우는 초강력 맥세이프 회전 스탠드 그립',
    category: 'it/전자기기',
    platform: 'YouTube',
    viewCount: 1700000,
    thumbnail: 'https://images.unsplash.com/photo-1584282479261-26c7f42cf502?auto=format&fit=crop&w=500&q=80',
    creator: '기어랩',
    tags: ['맥세이프', '스마트폰거치대', '데스크셋업'],
    engagementRate: 7.1,
  },
  {
    title: '단 1초만에 과일 씨앗을 제거하는 신기한 주방용 슬라이서',
    category: '리빙/아이디어',
    platform: 'TikTok',
    viewCount: 4200000,
    thumbnail: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80',
    creator: 'KitchenHacks',
    tags: ['주방꿀템', '과일깎이', '요리팁'],
    engagementRate: 11.8,
  },
  {
    title: '흔들려도 국물이 새지 않는 특허받은 실리콘 밀폐 배달 용기 커버',
    category: '유용한 꿀팁',
    platform: 'TikTok',
    viewCount: 850000,
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    creator: '팩트체커',
    tags: ['밀폐커버', '실리콘', '자취생꿀템'],
    engagementRate: 5.9,
  },
  {
    title: '올리브영 품절 대란! 얼음과 같이 시원해지는 쿨링 마사지 괄사 스틱',
    category: '뷰티/패션',
    platform: 'TikTok',
    viewCount: 2000000,
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80',
    creator: '뷰스타민',
    tags: ['쿨링괄사', '부기제거', '셀프마사지'],
    engagementRate: 8.1,
  },
  {
    title: '버튼 하나만 누르면 5분 만에 살균 탈취완료하는 휴대용 신발 건조기',
    category: '리빙/아이디어',
    platform: 'YouTube',
    viewCount: 1400000,
    thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80',
    creator: '살림왕',
    tags: ['신발관리', '휴대용건조기', '살균기'],
    engagementRate: 7.4,
  },
  {
    title: '초당 30,000번 진동으로 피지를 쏙 빼주는 초음파 아쿠아 필링기',
    category: '뷰티/패션',
    platform: 'YouTube',
    viewCount: 2800000,
    thumbnail: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=500&q=80',
    creator: 'SkincareDiary',
    tags: ['아쿠아필링기', '블랙헤드', '모공청소'],
    engagementRate: 9.0,
  },
  {
    title: '에어컨 필터를 물 세척 없이 터는 강력 무선 에어건 먼지 털이',
    category: '리빙/아이디어',
    platform: 'TikTok',
    viewCount: 3500000,
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80',
    creator: 'TechBusters',
    tags: ['에어건', '먼지청소', '키보드청소'],
    engagementRate: 10.2,
  },
  {
    title: '3분 만에 완성되는 초간단 에어프라이어 요리 레시피 모음',
    category: '푸드/레시피',
    platform: 'TikTok',
    viewCount: 980000,
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80',
    creator: 'CookingShorts',
    tags: ['에어프라이어', '간단요리', '자취요리'],
    engagementRate: 6.8,
  },
];

const TITLE_VARIANTS = [
  { prefix: '초간단 신작', suffix: '초급속 에어쿠션 쿨링시트' },
  { prefix: '대륙의 실수', suffix: '초미니 캠핑 접이식 주전자' },
  { prefix: '자취방 필수품', suffix: '무선 리모컨 부착 미니 선풍기' },
  { prefix: '역대급 편리함', suffix: '자동 라벨 부착 바코드 마킹기' },
  { prefix: 'SNS 대란', suffix: '3초 밀봉 무선 미니 진공 실러' },
];

const PLATFORMS = ['TikTok', 'YouTube', 'TikTok & YouTube'];

/**
 * 바이럴 TOP50 카드 목록 생성
 */
export function generateViralCards() {
  const cards = [];

  for (let i = 0; i < 50; i++) {
    const base = BASE_CARDS[i % BASE_CARDS.length];
    const variant = TITLE_VARIANTS[i % TITLE_VARIANTS.length];
    const viewCount = Math.floor(base.viewCount * (1.2 - i * 0.015));

    let title = base.title;
    if (i >= BASE_CARDS.length) {
      title = `[${variant.prefix}] ${base.title.split(' ').slice(1).join(' ')} - ${variant.suffix}`;
    }

    const viralScore = calculateViralScore({
      viewCount,
      engagementRate: base.engagementRate - i * 0.05,
      category: base.category,
    });

    const coupangScore = calculateCoupangScore({ category: base.category, viralScore });

    cards.push({
      id: `viral-${i + 1}`,
      rank: i + 1,
      title,
      thumbnail: base.thumbnail,
      category: base.category,
      platform: PLATFORMS[i % PLATFORMS.length],
      viewCount,
      viewCountFormatted: formatViewCount(viewCount),
      viralScore,
      coupangScore,
      creator: base.creator,
      tags: [...base.tags],
      engagementRate: base.engagementRate,
      sourceUrl: base.platform === 'YouTube' ? 'https://www.youtube.com' : 'https://www.tiktok.com',
    });
  }

  return cards.sort((a, b) => b.viralScore - a.viralScore);
}
