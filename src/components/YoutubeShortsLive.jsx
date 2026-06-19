import { useMemo } from 'react';
import PageHeader from './PageHeader';
import SearchBar from './SearchBar';
import ShortsFilterBar from './ShortsFilterBar';
import ViralCard from './ViralCard';
import Workspace from './Workspace';
import { CATEGORIES } from '../data/categories';
import { YOUTUBE_REGIONS } from '../data/youtubeShortsData';
import { useYoutubeShortsLive } from '../hooks/useYoutubeShortsLive';
import '../styles/youtubeShortsLive.css';
import '../styles/dashboard.css';

function formatSyncTime(iso) {
  if (!iso) return '--:--:--';
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function YoutubeShortsLive({ workspace }) {
  const live = useYoutubeShortsLive();

  const sourceLabel = useMemo(() => {
    if (live.dataSource === 'youtube-api') return '📡 YouTube API 실시간';
    return '⏳ 데이터 수집 대기';
  }, [live.dataSource]);

  return (
    <div className="youtube-shorts-live">
      <PageHeader
        icon="📺"
        title="유튜브 쇼츠 실시간"
        description="YouTube Shorts 알고리즘 피드를 실시간으로 수집합니다. 30초마다 자동 갱신되며, 카드 클릭 시 Workspace가 자동 생성됩니다."
      />

      <div className="youtube-shorts-live-toolbar glass-panel">
        <SearchBar value={live.search} onChange={live.setSearch} />
        <ShortsFilterBar
          sortBy={live.sortBy}
          onSortChange={live.setSort}
          onRefresh={live.refresh}
          isRefreshing={live.isRefreshing}
        />
      </div>

      <div className="youtube-shorts-live-bar">
        <div className="youtube-shorts-live-left">
          <span className="youtube-shorts-live-dot" />
          <span className="youtube-shorts-live-text">LIVE</span>
          <span className="youtube-shorts-live-source">{sourceLabel}</span>
          {live.newCount > 0 && (
            <span className="youtube-shorts-live-new">+{live.newCount} 신규</span>
          )}
        </div>
        <div className="youtube-shorts-live-right">
          <div className="youtube-shorts-live-regions">
            {YOUTUBE_REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`youtube-shorts-live-region ${live.region === r.id ? 'youtube-shorts-live-region--active' : ''}`}
                onClick={() => live.setRegion(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <label className="youtube-shorts-live-auto">
            <input
              type="checkbox"
              checked={live.autoRefresh}
              onChange={(e) => live.setAutoRefresh(e.target.checked)}
            />
            자동 갱신 (30초)
          </label>
          <span className="youtube-shorts-live-sync">동기화: {formatSyncTime(live.syncedAt)}</span>
        </div>
      </div>

      {live.apiError && (
        <p className="youtube-shorts-live-error">⚠️ {live.apiError}</p>
      )}

      <div className="app-content">
        <div className="youtube-shorts-live-main">
          <div className="dashboard-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`dashboard-category-btn ${live.category === cat ? 'dashboard-category-btn--active' : ''}`}
                onClick={() => live.setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="dashboard-status youtube-shorts-live-status">
            <div className="dashboard-status-left">
              <span className="dashboard-status-dot youtube-shorts-live-status-dot" />
              <p>
                YouTube Shorts
                {live.search ? ` "${live.search}"` : ''}: <strong>{live.totalCount}개</strong> 검색됨
                {live.category !== '전체' && ` · ${live.category}`}
              </p>
            </div>
            <span className="dashboard-status-sync">
              지역: {live.region} · {live.sortBy === 'views' ? '조회수' : live.sortBy === 'likes' ? '좋아요' : '바이럴'} 정렬
            </span>
          </div>

          {live.isRefreshing && live.cards.length === 0 ? (
            <div className="dashboard-loading">
              <div className="dashboard-spinner" />
              <p>YouTube Shorts 피드를 수집 중입니다...</p>
            </div>
          ) : live.cards.length > 0 ? (
            <>
              <div className={`dashboard-grid ${live.isRefreshing ? 'dashboard-grid--updating' : ''}`}>
                {live.cards.map((card) => (
                  <ViralCard
                    key={card.id}
                    card={card}
                    isSelected={workspace.selectedCard?.id === card.id}
                    onSelect={workspace.selectCard}
                    showAlgorithm={false}
                  />
                ))}
              </div>
              {live.hasMore && (
                <div className="dashboard-load-more">
                  <button type="button" className="dashboard-load-more-btn" onClick={live.loadMore}>
                    추가 Shorts 로드
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="dashboard-empty">
              <span className="dashboard-empty-icon">📺</span>
              <p>조건에 맞는 YouTube Shorts가 없습니다.</p>
              <button type="button" className="dashboard-reset-btn" onClick={live.resetFilters}>
                필터 초기화
              </button>
            </div>
          )}
        </div>

        <Workspace
          selectedCard={workspace.selectedCard}
          analysis={workspace.analysis}
          isAnalyzing={workspace.isAnalyzing}
          scriptTone={workspace.scriptTone}
          aiSource={workspace.aiSource}
          analysisError={workspace.analysisError}
          geminiBlocked={workspace.geminiBlocked}
          copiedId={workspace.copiedId}
          onToneChange={workspace.setTone}
          onCopy={workspace.copyToClipboard}
          onRetryGemini={workspace.retryGemini}
        />
      </div>
    </div>
  );
}
