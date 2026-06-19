import ViralCard from './ViralCard';
import PageHeader from './PageHeader';
import '../styles/dashboard.css';

const STAT_CARDS = [
  { key: 'collectedToday', icon: '📺', label: '수집된 쇼츠', color: 'indigo' },
  { key: 'analyzedToday', icon: '🤖', label: '분석 완료', color: 'emerald' },
  { key: 'aiRecommended', icon: '🔥', label: 'AI 추천', color: 'rose' },
  { key: 'coupangEligible', icon: '🛒', label: '쿠팡 연동 가능', color: 'amber' },
  { key: 'chinaCandidates', icon: '🌏', label: '중국 콘텐츠 후보', color: 'cyan' },
  { key: 'totalShorts', icon: '📈', label: '전체 수집', color: 'purple' },
];

function formatSyncTime(iso) {
  if (!iso) return '--:--:--';
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function Dashboard({
  stats,
  isLoading,
  error,
  syncedAt,
  source,
  onRefresh,
  onNavigateShorts,
  selectedCardId,
  onSelectCard,
}) {
  return (
    <div className="dashboard dashboard--v4">
      <PageHeader
        icon="🏠"
        title="대시보드 — 콘텐츠 제작 컨트롤 센터"
        description="YouTube Shorts 실시간 데이터를 기반으로 오늘의 트렌드와 AI 추천 콘텐츠를 한눈에 확인합니다."
      />

      <div className="dashboard-v4-toolbar">
        <div className="dashboard-v4-sync">
          <span className={`dashboard-v4-dot ${isLoading ? 'dashboard-v4-dot--loading' : ''}`} />
          <span>
            {source === 'youtube-api' ? '📡 YouTube API 실시간' : '데이터 대기 중'}
            {' · '}동기화 {formatSyncTime(syncedAt)}
          </span>
        </div>
        <div className="dashboard-v4-actions">
          <button type="button" className="dashboard-v4-refresh" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? '동기화 중...' : '🔄 새로고침'}
          </button>
          {onNavigateShorts && (
            <button type="button" className="dashboard-v4-goto" onClick={onNavigateShorts}>
              📺 유튜브 쇼츠 실시간 →
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="dashboard-v4-error">⚠️ {error}</p>
      )}

      <div className="dashboard-v4-stats">
        {STAT_CARDS.map(({ key, icon, label, color }) => (
          <div key={key} className={`dashboard-v4-stat dashboard-v4-stat--${color}`}>
            <span className="dashboard-v4-stat-icon">{icon}</span>
            <div>
              <p className="dashboard-v4-stat-value">{isLoading ? '—' : stats[key]}</p>
              <p className="dashboard-v4-stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-v4-panels">
        <section className="dashboard-v4-panel">
          <h3 className="dashboard-v4-panel-title">📈 실시간 트렌드 키워드</h3>
          {stats.trendKeywords.length > 0 ? (
            <div className="dashboard-v4-keywords">
              {stats.trendKeywords.map((kw) => (
                <span key={kw.word} className="dashboard-v4-keyword">
                  {kw.word}
                  <em>{kw.count}</em>
                </span>
              ))}
            </div>
          ) : (
            <p className="dashboard-v4-empty-text">수집된 데이터에서 키워드를 추출 중입니다.</p>
          )}
        </section>

        <section className="dashboard-v4-panel">
          <h3 className="dashboard-v4-panel-title">🔥 TOP5 급상승 콘텐츠</h3>
          {stats.topRising.length > 0 ? (
            <ul className="dashboard-v4-rising">
              {stats.topRising.map((card, i) => (
                <li key={card.id}>
                  <button type="button" className="dashboard-v4-rising-item" onClick={() => onSelectCard(card)}>
                    <span className="dashboard-v4-rising-rank">#{i + 1}</span>
                    <img src={card.thumbnail} alt="" className="dashboard-v4-rising-thumb" />
                    <div className="dashboard-v4-rising-info">
                      <p>{card.title.slice(0, 40)}...</p>
                      <span>↑{card.trendVelocity}% · {card.viewCountFormatted} · {card.viralScore}점</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dashboard-v4-empty-text">급상승 콘텐츠를 수집 중입니다.</p>
          )}
        </section>
      </div>

      <section className="dashboard-v4-panel dashboard-v4-panel--full">
        <h3 className="dashboard-v4-panel-title">🕐 최근 분석 콘텐츠</h3>
        {stats.recentAnalysis.length > 0 ? (
          <div className="dashboard-v4-recent">
            {stats.recentAnalysis.map((item) => (
              <div key={item.cardId} className="dashboard-v4-recent-item">
                {item.thumbnail && <img src={item.thumbnail} alt="" />}
                <div>
                  <p>{item.title?.slice(0, 35)}...</p>
                  <span>{new Date(item.analyzedAt).toLocaleString('ko-KR')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="dashboard-v4-empty-text">쇼츠 카드를 클릭하면 분석 기록이 여기에 표시됩니다.</p>
        )}
      </section>

      {stats.aiRecommendedList.length > 0 && (
        <section className="dashboard-v4-section">
          <h3 className="dashboard-v4-section-title">🤖 AI 추천 콘텐츠</h3>
          <div className="dashboard-grid">
            {stats.aiRecommendedList.map((card) => (
              <ViralCard
                key={card.id}
                card={card}
                isSelected={selectedCardId === card.id}
                onSelect={onSelectCard}
                showAlgorithm
              />
            ))}
          </div>
        </section>
      )}

      {isLoading && stats.totalShorts === 0 && (
        <div className="dashboard-loading">
          <div className="dashboard-spinner" />
          <p>YouTube Shorts 실시간 데이터를 수집 중입니다...</p>
        </div>
      )}
    </div>
  );
}
