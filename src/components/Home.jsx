import '../styles/youtube-platform.css';

const STEPS = [
  { icon: '🔍', title: '유튜브 검색', desc: '키워드로 영상을 검색합니다' },
  { icon: '⬇️', title: '다운로드', desc: 'MP4·MP3·자막을 추출합니다' },
  { icon: '🤖', title: 'AI 분석', desc: '요약·키워드·공부 노트를 생성합니다' },
  { icon: '🗄️', title: '히스토리', desc: 'Supabase에 분석 결과를 저장합니다' },
];

export default function Home({ onNavigate }) {
  return (
    <div className="yt-page">
      <div className="yt-home-hero">
        <h2>🎓 AI 유튜브 학습 플랫폼</h2>
        <p>검색 → 다운로드 → 자막 추출 → AI 분석 → 공부 노트까지 한 번에</p>
        <button type="button" className="yt-btn" onClick={() => onNavigate('youtubeSearch')}>
          🔍 유튜브 검색 시작
        </button>
      </div>

      <div className="yt-home-steps">
        {STEPS.map((s) => (
          <div key={s.title} className="yt-home-step">
            <span>{s.icon}</span>
            <h4>{s.title}</h4>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
