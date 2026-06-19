import '../styles/card.css';

function PlatformBadge({ platform }) {
  if (platform === 'TikTok') {
    return <span className="card-platform card-platform--tiktok">TikTok</span>;
  }
  if (platform === 'YouTube') {
    return <span className="card-platform card-platform--youtube">Shorts</span>;
  }
  return <span className="card-platform card-platform--multi">Multi</span>;
}

export default function ViralCard({ card, isSelected, onSelect, showAlgorithm = false }) {
  return (
    <article
      className={`viral-card ${isSelected ? 'viral-card--selected' : ''}`}
      onClick={() => onSelect(card)}
    >
      {isSelected && <div className="viral-card-glow" />}

      <div className="viral-card-thumb">
        <img
          src={card.thumbnail}
          alt={card.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=500&q=80';
          }}
        />
        <span className="viral-card-rank">#{card.rank}</span>
        {card.isNew && <span className="viral-card-new">NEW</span>}
        <PlatformBadge platform={card.platform} />
      </div>

      <div className="viral-card-body">
        <div className="viral-card-meta">
          <span className="viral-card-category">{card.category}</span>
          <span className="viral-card-engagement">참여율 {card.engagementRate}%</span>
        </div>
        <h3 className="viral-card-title">{card.title}</h3>
      </div>

      <div className="viral-card-metrics">
        <div className="viral-card-metric">
          <span className="viral-card-metric-label">조회수</span>
          <span className="viral-card-metric-value">{card.viewCountFormatted}</span>
        </div>
        {showAlgorithm ? (
          <>
            <div className="viral-card-metric">
              <span className="viral-card-metric-label">알고리즘</span>
              <span className="viral-card-metric-value viral-card-metric-value--high">
                {card.algorithmScore ?? card.viralScore}점
              </span>
            </div>
            <div className="viral-card-metric">
              <span className="viral-card-metric-label">급상승</span>
              <span className="viral-card-metric-value viral-card-metric-value--coupang">
                ↑{card.trendVelocity ?? 0}%
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="viral-card-metric">
              <span className="viral-card-metric-label">바이럴</span>
              <span className={`viral-card-metric-value ${card.viralScore > 90 ? 'viral-card-metric-value--high' : ''}`}>
                {card.viralScore}점
              </span>
            </div>
            <div className="viral-card-metric">
              <span className="viral-card-metric-label">쿠팡</span>
              <span className="viral-card-metric-value viral-card-metric-value--coupang">
                {card.coupangScore}%
              </span>
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        className={`viral-card-btn ${isSelected ? 'viral-card-btn--active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(card);
        }}
      >
        ✨ {isSelected ? '분석 데이터 확인 중' : '분석하기'}
      </button>
    </article>
  );
}
