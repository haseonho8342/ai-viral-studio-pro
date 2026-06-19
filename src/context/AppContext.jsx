import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { fetchYouTubeShortsFeed } from '../services/youtubeShortsEngine';
import {
  buildWorkspaceAnalysis,
  buildAnalysisWithGemini,
  regenerateScriptsLocal,
  regenerateScriptsWithGemini,
} from '../services/analysisEngine';
import { isGeminiBlocked, setGeminiBlocked } from '../services/geminiService';

const HISTORY_KEY = 'avs_analysis_history_v4';
const POLL_INTERVAL = 30000;

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(entry) {
  const history = loadHistory();
  const filtered = history.filter((h) => h.cardId !== entry.cardId);
  const updated = [entry, ...filtered].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

const AppContext = createContext(null);

const initialState = {
  shortsFeed: [],
  shortsSyncedAt: null,
  shortsSource: null,
  shortsError: null,
  shortsRegion: 'KR',
  isLoadingShorts: false,
  selectedCard: null,
  analysis: null,
  analysisHistory: loadHistory(),
  scriptTone: 'aggressive',
  isAnalyzing: false,
  geminiBlocked: isGeminiBlocked(),
  mobileMenuOpen: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SHORTS_LOADING':
      return { ...state, isLoadingShorts: true, shortsError: null };

    case 'SHORTS_LOADED':
      return {
        ...state,
        shortsFeed: action.payload.cards,
        shortsSyncedAt: action.payload.syncedAt,
        shortsSource: action.payload.source,
        shortsError: action.payload.error || null,
        isLoadingShorts: false,
      };

    case 'SHORTS_ERROR':
      return {
        ...state,
        shortsError: action.payload,
        isLoadingShorts: false,
      };

    case 'SET_SHORTS_REGION':
      return { ...state, shortsRegion: action.payload };

    case 'SELECT_CARD':
      return {
        ...state,
        selectedCard: action.payload.card,
        analysis: action.payload.analysis,
        analysisHistory: action.payload.history,
        isAnalyzing: false,
      };

    case 'START_GEMINI':
      return { ...state, isAnalyzing: true };

    case 'SET_ANALYSIS':
      return {
        ...state,
        analysis: action.payload,
        isAnalyzing: false,
        analysisHistory: action.history || state.analysisHistory,
      };

    case 'SET_TONE':
      return { ...state, scriptTone: action.payload };

    case 'SET_GEMINI_BLOCKED':
      return { ...state, geminiBlocked: action.payload };

    case 'SET_HISTORY':
      return { ...state, analysisHistory: action.payload };

    case 'TOGGLE_MOBILE_MENU':
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };

    case 'SET_MOBILE_MENU':
      return { ...state, mobileMenuOpen: action.payload };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const loadShortsFeed = useCallback(async (region) => {
    const r = region || stateRef.current.shortsRegion;
    dispatch({ type: 'SHORTS_LOADING' });
    try {
      const result = await fetchYouTubeShortsFeed({ region: r });
      dispatch({ type: 'SHORTS_LOADED', payload: result });
    } catch (err) {
      dispatch({ type: 'SHORTS_ERROR', payload: err.message });
      dispatch({ type: 'SHORTS_LOADED', payload: { cards: [], source: null, syncedAt: null, error: err.message } });
    }
  }, []);

  useEffect(() => {
    loadShortsFeed('KR');

    const onConfigReady = () => loadShortsFeed('KR');
    window.addEventListener('runtime-config-ready', onConfigReady);
    return () => window.removeEventListener('runtime-config-ready', onConfigReady);
  }, [loadShortsFeed]);

  const selectCard = useCallback((card) => {
    if (!card) return;
    const analysis = buildWorkspaceAnalysis(card, stateRef.current.scriptTone);
    const history = saveHistory({
      cardId: card.id,
      title: card.title,
      thumbnail: card.thumbnail,
      analyzedAt: new Date().toISOString(),
      viralScore: card.viralScore,
    });
    dispatch({
      type: 'SELECT_CARD',
      payload: { card, analysis, history },
    });
  }, []);

  const retryGemini = useCallback(async () => {
    const card = stateRef.current.selectedCard;
    if (!card) return;
    setGeminiBlocked(false);
    dispatch({ type: 'SET_GEMINI_BLOCKED', payload: false });
    dispatch({ type: 'START_GEMINI' });
    try {
      const analysis = await buildAnalysisWithGemini(card, stateRef.current.scriptTone);
      if (stateRef.current.selectedCard?.id === card.id) {
        dispatch({ type: 'SET_ANALYSIS', payload: analysis });
      }
    } catch (err) {
      dispatch({ type: 'SET_GEMINI_BLOCKED', payload: isGeminiBlocked() });
      if (stateRef.current.selectedCard?.id === card.id) {
        const current = stateRef.current.analysis;
        dispatch({
          type: 'SET_ANALYSIS',
          payload: { ...current, error: err.message, source: 'rules' },
        });
      }
    }
  }, []);

  const setTone = useCallback((tone) => {
    dispatch({ type: 'SET_TONE', payload: tone });
    const card = stateRef.current.selectedCard;
    if (!card) return;
    const current = stateRef.current.analysis;
    const updated = regenerateScriptsLocal(card, tone, current);
    dispatch({ type: 'SET_ANALYSIS', payload: updated });
  }, []);

  const setShortsRegion = useCallback((region) => {
    dispatch({ type: 'SET_SHORTS_REGION', payload: region });
    loadShortsFeed(region);
  }, [loadShortsFeed]);

  const value = {
    state,
    dispatch,
    loadShortsFeed,
    selectCard,
    retryGemini,
    setTone,
    setShortsRegion,
    toggleMobileMenu: () => dispatch({ type: 'TOGGLE_MOBILE_MENU' }),
    setMobileMenuOpen: (open) => dispatch({ type: 'SET_MOBILE_MENU', payload: open }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default AppContext;
