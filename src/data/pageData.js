/**
 * pageData.js - 사이드바 개별 페이지용 더미 데이터
 */

export const HOT_TIKTOK_SOUNDS = [
  { title: 'Magnetic - Slowed Acoustic Remix', creator: '@illit_official', duration: '0:15', viralScore: 98, searchVolume: '23M posts' },
  { title: 'Supernova - Chill Bass Version', creator: '@aespa_official', duration: '0:22', viralScore: 95, searchVolume: '14M posts' },
  { title: 'Cute Home Organizing ASMR Pop', creator: '@living_tok_sound', duration: '0:50', viralScore: 92, searchVolume: '8M posts' },
  { title: 'Cyberpunk Tech Gadget BGM', creator: '@gear_reviewer_bgm', duration: '0:45', viralScore: 89, searchVolume: '4M posts' },
];

export const YOUTUBE_COMPETITORS = [
  { channel: '1분 살림살이 백서', subCount: '245K', tags: ['#수납치트키', '#살림꿀팁', '#신박템'], viewsAvg: '480K/shorts' },
  { channel: '자취해킹연구소 shorts', subCount: '190K', tags: ['#자취방꿀템', '#미니가전', '#인테리어등'], viewsAvg: '350K/shorts' },
  { channel: '하우스 핵킹 kr', subCount: '110K', tags: ['#주방정리', '#인기대란', '#쿠팡필수품'], viewsAvg: '290K/shorts' },
];

export const COUPANG_PRODUCTS = [
  { name: '[공식] 토토 스마트 스스로 봉투밀봉 반자동 쓰레기통 2.0', category: '리빙/아이디어', price: 29800, commRate: 3, clicks: 1240, conversions: 48, commission: 42912 },
  { name: '[특가] 스마트폰 사진 즉석 휴대용 미니 잉크리스 프린터', category: 'it/전자기기', price: 68000, commRate: 3, clicks: 890, conversions: 24, commission: 48960 },
  { name: '[실시간 2위] 붙이기만하면 끝! 무선 모션감지 LED 센서바', category: '리빙/아이디어', price: 14500, commRate: 3, clicks: 2310, conversions: 110, commission: 47850 },
  { name: '[SNS대란] 360도 회전 주방용 회전형 삼중 수납 트레이', category: '리빙/아이디어', price: 9800, commRate: 3, clicks: 1420, conversions: 80, commission: 23520 },
  { name: '[대륙공수] 초당 30,000 진동 미세피지 초음파 아쿠아필러', category: '뷰티/패션', price: 34000, commRate: 3, clicks: 750, conversions: 18, commission: 18360 },
];

export const MOCK_ANALYTICS = {
  stats: [
    { title: '누적 노출수', value: '1.24M', change: '+12.4%', subtitle: '지난 30일 누적', icon: '👁' },
    { title: '평균 클릭률', value: '7.82%', change: '+1.5%', subtitle: '인포크 링크 유입율', icon: '📈' },
    { title: '고정 시청층', value: '87.4K', change: '+8.3%', subtitle: '채널 합산 구독자', icon: '👥' },
    { title: '예상 수수료', value: '₩2,890,000', change: '+24.1%', subtitle: '쿠팡 기여 지수', icon: '💰' },
  ],
  viralTrends: [
    { date: '06-12', count: 140, clickRate: '4.2%', height: 20 },
    { date: '06-13', count: 185, clickRate: '4.8%', height: 35 },
    { date: '06-14', count: 210, clickRate: '5.1%', height: 42 },
    { date: '06-15', count: 295, clickRate: '5.8%', height: 56 },
    { date: '06-16', count: 320, clickRate: '6.2%', height: 60 },
    { date: '06-17', count: 480, clickRate: '7.4%', height: 84 },
    { date: '06-18', count: 520, clickRate: '8.2%', height: 95 },
  ],
  categoryShare: [
    { name: '리빙/아이디어', value: 45, color: '#6366f1' },
    { name: '뷰티/패션', value: 20, color: '#ec4899' },
    { name: 'it/전자기기', value: 25, color: '#3b82f6' },
    { name: '푸드/레시피', value: 10, color: '#10b981' },
  ],
  channels: {
    tiktok: [
      { rank: 1, account: '@viral_master_daily', followers: '142K', viewsAvg: '480K', profit: '₩1,890,000' },
      { rank: 2, account: '@living_cheatkey', followers: '98K', viewsAvg: '350K', profit: '₩1,240,000' },
      { rank: 3, account: '@tech_gaw_review', followers: '87K', viewsAvg: '310K', profit: '₩980,000' },
    ],
    youtube: [
      { rank: 1, account: '1분 살림백서', sub: '240K', viewsAvg: '580K', profit: '₩2,900,000' },
      { rank: 2, account: '꿀템 사냥꾼 shorts', sub: '180K', viewsAvg: '420K', profit: '₩1,950,000' },
      { rank: 3, account: '자취 치트키', sub: '110K', viewsAvg: '290K', profit: '₩1,300,000' },
    ],
  },
};

export const DEFAULT_INPOCK_LINKS = [
  { id: '1', title: '🔥 [보러가기] 스마트 스스로 밀봉 쓰레기통 45% 특가', url: 'https://link.coupang.com/a/ex-1' },
  { id: '2', title: '✨ [최저가] 버튼식 휴대용 미니 잉크리스 프린터', url: 'https://link.coupang.com/a/ex-2' },
  { id: '3', title: '💡 [핫템] 옷장 무선 모션 센서 LED바', url: 'https://link.coupang.com/a/ex-3' },
];

export const THUMBNAIL_PRESETS = [
  { name: 'Cosmic Twilight', value: 'linear-gradient(135deg, #090d16 0%, #151a2e 50%, #030712 100%)' },
  { name: 'Neon Abyss', value: 'linear-gradient(135deg, #0B1528 0%, #082E47 100%)' },
  { name: 'Cyber Eclipse', value: 'linear-gradient(135deg, #180828 0%, #090214 100%)' },
  { name: 'Toxic Emerald', value: 'linear-gradient(135deg, #021a11 0%, #090f0c 100%)' },
];
