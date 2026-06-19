import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export function useWorkspace() {
  const { state, selectCard, setTone, retryGemini } = useApp();
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = useCallback((text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return {
    selectedCard: state.selectedCard,
    analysis: state.analysis,
    isAnalyzing: state.isAnalyzing,
    scriptTone: state.scriptTone,
    aiSource: state.analysis?.source || null,
    analysisError: state.analysis?.error || null,
    geminiBlocked: state.geminiBlocked,
    copiedId,
    selectCard,
    setTone,
    retryGemini,
    copyToClipboard,
  };
}

export default useWorkspace;
