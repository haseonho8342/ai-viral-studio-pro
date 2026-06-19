import { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { filterYouTubeCards } from '../services/youtubeShortsEngine';

const POLL_INTERVAL = 30000;

export function useYoutubeShortsLive() {
  const { state, loadShortsFeed, setShortsRegion } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('views');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [newCount, setNewCount] = useState(0);

  const filteredCards = useMemo(
    () => filterYouTubeCards(state.shortsFeed, { search, category, sortBy }),
    [state.shortsFeed, search, category, sortBy]
  );

  const refresh = useCallback(() => {
    setNewCount(0);
    loadShortsFeed(state.shortsRegion);
  }, [loadShortsFeed, state.shortsRegion]);

  const changeRegion = useCallback((r) => {
    setShortsRegion(r);
    setNewCount(0);
  }, [setShortsRegion]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    const timer = setInterval(() => loadShortsFeed(state.shortsRegion), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [autoRefresh, loadShortsFeed, state.shortsRegion]);

  useEffect(() => {
    setVisibleCount(12);
  }, [search, category, sortBy]);

  return {
    cards: filteredCards.slice(0, visibleCount),
    totalCount: filteredCards.length,
    search,
    setSearch,
    category,
    setCategory,
    sortBy,
    setSort: setSortBy,
    region: state.shortsRegion,
    setRegion: changeRegion,
    isRefreshing: state.isLoadingShorts,
    autoRefresh,
    setAutoRefresh,
    hasMore: filteredCards.length > visibleCount,
    loadMore: () => setVisibleCount((n) => n + 12),
    refresh,
    resetFilters: () => {
      setSearch('');
      setCategory('전체');
      setSortBy('views');
    },
    dataSource: state.shortsSource,
    syncedAt: state.shortsSyncedAt,
    apiError: state.shortsError,
    newCount,
  };
}

export default useYoutubeShortsLive;
