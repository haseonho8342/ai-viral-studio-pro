import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { computeDashboardStats } from '../services/dashboardEngine';

export function useDashboard() {
  const { state, loadShortsFeed, selectCard } = useApp();

  const stats = useMemo(
    () => computeDashboardStats(state.shortsFeed, state.analysisHistory),
    [state.shortsFeed, state.analysisHistory]
  );

  return {
    stats,
    shortsFeed: state.shortsFeed,
    isLoading: state.isLoadingShorts,
    error: state.shortsError,
    syncedAt: state.shortsSyncedAt,
    source: state.shortsSource,
    refresh: () => loadShortsFeed(state.shortsRegion),
    selectCard,
    onNavigateShorts: null,
  };
}

export default useDashboard;
