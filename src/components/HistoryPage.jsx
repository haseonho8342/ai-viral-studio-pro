import { useEffect, useState } from 'react';
import { fetchRecentVideos, fetchRecentAnalysis, searchVideoHistory } from '../services/videoDb';
import '../styles/youtube-platform.css';

export default function HistoryPage({ onSelectVideo }) {
  const [videos, setVideos] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('videos');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [v, a] = await Promise.all([
      search ? searchVideoHistory(search) : fetchRecentVideos(50),
      fetchRecentAnalysis(50),
    ]);
    setVideos(v);
    setAnalysis(a);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="yt-page">
      <div className="yt-page-header">
        <h2>📚 History</h2>
        <p>Supabase에 저장된 영상·분석 히스토리</p>
      </div>

      <form className="yt-search-bar" onSubmit={handleSearch}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="검색..." />
        <button type="submit" className="yt-btn">검색</button>
      </form>

      <div className="yt-actions" style={{ marginBottom: '1rem' }}>
        <button type="button" className={`yt-btn yt-btn--sm ${tab === 'videos' ? '' : 'yt-btn--outline'}`} onClick={() => setTab('videos')}>영상</button>
        <button type="button" className={`yt-btn yt-btn--sm ${tab === 'analysis' ? '' : 'yt-btn--outline'}`} onClick={() => setTab('analysis')}>AI 분석</button>
      </div>

      {loading ? (
        <div className="yt-loading"><div className="yt-spinner" /></div>
      ) : tab === 'videos' ? (
        <div className="yt-history-list">
          {videos.map((v) => (
            <div key={v.id} className="yt-history-item" onClick={() => onSelectVideo(v.video_id)} role="button" tabIndex={0}>
              {v.thumbnail && <img src={v.thumbnail} alt="" />}
              <div className="yt-history-item-info">
                <p>{v.title}</p>
                <span>{v.channel} · {new Date(v.created_at).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
          ))}
          {videos.length === 0 && <p className="yt-card-meta">저장된 영상이 없습니다.</p>}
        </div>
      ) : (
        analysis.map((a) => (
          <div key={a.id} className="yt-panel" style={{ marginBottom: '0.75rem' }}>
            <p className="yt-card-meta">{a.video_id} · {new Date(a.created_at).toLocaleString('ko-KR')}</p>
            <p className="yt-text">{a.summary || a.study_note || a.keywords || '(내용 없음)'}</p>
          </div>
        ))
      )}
    </div>
  );
}
