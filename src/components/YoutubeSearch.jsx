import { useState } from 'react';
import { searchYouTubeVideos } from '../services/youtubeSearchEngine';
import '../styles/youtube-platform.css';

export default function YoutubeSearch({ onSelectVideo }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const videos = await searchYouTubeVideos(query);
      setResults(videos);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yt-page">
      <div className="yt-page-header">
        <h2>🔍 YouTube Search</h2>
        <p>YouTube Data API v3로 영상을 검색합니다</p>
      </div>

      <form className="yt-search-bar" onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요 (예: 파이썬 강의, AI 튜토리얼)"
        />
        <button type="submit" className="yt-btn" disabled={loading}>
          {loading ? '검색 중...' : '검색'}
        </button>
      </form>

      {error && <p className="yt-error">{error}</p>}

      {loading && (
        <div className="yt-loading">
          <div className="yt-spinner" />
          <p>영상을 검색하고 있습니다...</p>
        </div>
      )}

      <div className="yt-grid">
        {results.map((v) => (
          <article
            key={v.videoId}
            className="yt-card"
            onClick={() => onSelectVideo(v.videoId)}
            onKeyDown={(e) => e.key === 'Enter' && onSelectVideo(v.videoId)}
            role="button"
            tabIndex={0}
          >
            <img src={v.thumbnail} alt="" className="yt-card-thumb" loading="lazy" />
            <div className="yt-card-body">
              <p className="yt-card-title">{v.title}</p>
              <p className="yt-card-meta">
                {v.channel} · {v.viewCountFormatted}회 · {v.duration}
              </p>
              <p className="yt-card-meta">
                {new Date(v.publishedAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
