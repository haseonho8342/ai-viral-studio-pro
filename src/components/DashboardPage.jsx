import { useEffect, useState } from 'react';
import { fetchRecentVideos, fetchRecentAnalysis } from '../services/videoDb';
import '../styles/youtube-platform.css';

export default function DashboardPage({ onSelectVideo, onNavigate }) {
  const [videos, setVideos] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchRecentVideos(10), fetchRecentAnalysis(10)])
      .then(([v, a]) => { setVideos(v); setAnalysis(a); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? videos.filter((v) =>
        v.title?.toLowerCase().includes(search.toLowerCase()) ||
        v.channel?.toLowerCase().includes(search.toLowerCase())
      )
    : videos;

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="yt-page">
      <div className="yt-page-header">
        <h2>📊 Dashboard</h2>
        <p>최근 분석·다운로드·AI 결과를 한눈에 확인합니다</p>
      </div>

      <div className="yt-search-bar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="영상 제목·채널 검색..."
        />
        <button type="button" className="yt-btn" onClick={() => onNavigate('youtubeSearch')}>
          + 새 검색
        </button>
      </div>

      {loading ? (
        <div className="yt-loading"><div className="yt-spinner" /><p>로딩 중...</p></div>
      ) : (
        <>
          <div className="yt-panel">
            <h4>📺 최근 분석 영상 (최신순)</h4>
            {sorted.length === 0 ? (
              <p className="yt-card-meta">아직 저장된 영상이 없습니다.</p>
            ) : (
              <div className="yt-history-list">
                {sorted.map((v) => (
                  <div
                    key={v.id}
                    className="yt-history-item"
                    onClick={() => onSelectVideo(v.video_id)}
                    onKeyDown={(e) => e.key === 'Enter' && onSelectVideo(v.video_id)}
                    role="button"
                    tabIndex={0}
                  >
                    {v.thumbnail && <img src={v.thumbnail} alt="" />}
                    <div className="yt-history-item-info">
                      <p>{v.title}</p>
                      <span>{v.channel} · {new Date(v.created_at).toLocaleString('ko-KR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="yt-panel">
            <h4>🤖 최근 AI 분석 결과</h4>
            {analysis.length === 0 ? (
              <p className="yt-card-meta">아직 AI 분석 결과가 없습니다.</p>
            ) : (
              analysis.map((a) => (
                <div key={a.id} className="yt-panel" style={{ marginTop: '0.5rem', padding: '0.85rem' }}>
                  <p className="yt-card-meta">video: {a.video_id} · {new Date(a.created_at).toLocaleString('ko-KR')}</p>
                  <p className="yt-text">{(a.summary || a.three_line_summary || a.keywords || '').slice(0, 200)}...</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
