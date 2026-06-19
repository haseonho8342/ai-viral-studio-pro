import { createContext, useContext, useReducer, useCallback, useState, useEffect } from 'react';
import { initSupabaseSession } from '../services/supabaseDb';

const AppContext = createContext(null);

const initialState = {
  mobileMenuOpen: false,
  supabaseReady: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_SUPABASE_READY':
      return { ...state, supabaseReady: action.payload };
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
  const [analysisVideo, setAnalysisVideo] = useState(null);
  const [analysisSubtitle, setAnalysisSubtitle] = useState('');

  useEffect(() => {
    initSupabaseSession().then((s) => {
      dispatch({ type: 'SET_SUPABASE_READY', payload: s.connected });
    });
  }, []);

  const setAnalysisContext = useCallback((video, subtitle) => {
    setAnalysisVideo(video);
    setAnalysisSubtitle(subtitle || '');
  }, []);

  const clearAnalysisContext = useCallback(() => {
    setAnalysisVideo(null);
    setAnalysisSubtitle('');
  }, []);

  const value = {
    state,
    analysisVideo,
    analysisSubtitle,
    setAnalysisContext,
    clearAnalysisContext,
    toggleMobileMenu: () => dispatch({ type: 'TOGGLE_MOBILE_MENU' }),
    setMobileMenuOpen: (open) => dispatch({ type: 'SET_MOBILE_MENU', payload: open }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
