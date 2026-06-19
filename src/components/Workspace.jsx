import { useState } from 'react';
import '../styles/workspace.css';

const TABS = [
  { id: 'overview', label: '전체', icon: '📋' },
  { id: 'products', label: '쿠팡', icon: '🛒' },
  { id: 'translate', label: '중국어', icon: '🌏' },
  { id: 'script', label: '대본', icon: '🎬' },
  { id: 'thumbnail', label: '썸네일', icon: '🖼' },
];

const TONES = [
  { id: 'aggressive', label: '어그로형' },
  { id: 'friendly', label: '친근형' },
  { id: 'humor', label: '유머형' },
];

const SOURCE_LABELS = {
  gemini: '✨ Gemini AI',
  rules: '⚙️ 규칙 기반 엔진',
};

function CopyButton({ text, id, copiedId, onCopy, label = '복사' }) {
  const isCopied = copiedId === id;
  return (
    <button type="button" className="workspace-copy-btn" onClick={() => onCopy(text, id)}>
      {isCopied ? '✓ 복사됨' : `📋 ${label}`}
    </button>
  );
}

function Section({ title, children, copyText, copyId, copiedId, onCopy }) {
  return (
    <section className="workspace-section">
      <div className="workspace-section-header">
        <h4>{title}</h4>
        {copyText && <CopyButton text={copyText} id={copyId} copiedId={copiedId} onCopy={onCopy} />}
      </div>
      <div className="workspace-section-body">{children}</div>
    </section>
  );
}

export default function Workspace({
  selectedCard,
  analysis,
  isAnalyzing,
  scriptTone,
  aiSource,
  analysisError,
  geminiBlocked,
  copiedId,
  onToneChange,
  onCopy,
  onRetryGemini,
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!selectedCard) {
    return (
      <div className="workspace workspace--empty">
        <div className="workspace-empty-icon">🤖</div>
        <h3>AI 작업 센터</h3>
        <p>
          유튜브 쇼츠 카드를 클릭하면 <strong>규칙 기반 엔진</strong>이 자동으로
          쿠팡·인포크·중국어·대본·썸네일을 생성합니다.
        </p>
        <ul className="workspace-empty-features">
          <li>쿠팡 파트너스 · 인포크 링크</li>
          <li>중국어 번역 · 샤오홍슈 검색어</li>
          <li>30초/60초 대본 · 썸네일 문구</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="workspace">
      <div className="workspace-header">
        <div className="workspace-badge">
          <span className={aiSource === 'gemini' ? 'workspace-badge--gemini' : 'workspace-badge--rules'}>
            {SOURCE_LABELS[aiSource] || SOURCE_LABELS.rules}
          </span>
          {isAnalyzing && <span className="workspace-analyzing">Gemini 분석 중...</span>}
        </div>

        {geminiBlocked && (
          <div className="workspace-quota-block">
            <p>⚠️ Gemini 사용량 초과 — 자동 AI 분석이 중지되었습니다.</p>
            {onRetryGemini && (
              <button type="button" className="workspace-retry-btn" onClick={onRetryGemini} disabled={isAnalyzing}>
                🔄 Gemini 재시도
              </button>
            )}
          </div>
        )}

        {analysisError && !geminiBlocked && !isAnalyzing && (
          <p className="workspace-error">⚠️ {analysisError}</p>
        )}

        <h3 className="workspace-title">{analysis?.title || selectedCard.title}</h3>
        <p className="workspace-subtitle">
          {selectedCard.category} · 조회수 {selectedCard.viewCountFormatted}
          {selectedCard.likeCount != null && ` · ❤️ ${selectedCard.likeCount}`}
        </p>
      </div>

      <div className="workspace-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`workspace-tab ${activeTab === tab.id ? 'workspace-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {isAnalyzing ? (
        <div className="workspace-skeleton">
          <div className="workspace-skeleton-line" />
          <div className="workspace-skeleton-line workspace-skeleton-line--short" />
          <p>Gemini AI 분석 중...</p>
        </div>
      ) : analysis ? (
        <div className="workspace-content">
          {(activeTab === 'overview' || activeTab === 'products') && (
            <>
              <Section title="🛒 추천 상품" copyText={analysis?.products?.map((p) => `${p.name}\n${p.link}`).join('\n\n')} copyId="products" copiedId={copiedId} onCopy={onCopy}>
                {analysis?.products?.map((product, idx) => (
                  <div key={idx} className="workspace-product">
                    <div className="workspace-product-header">
                      <span className="workspace-product-price">{product.price}</span>
                      <span className="workspace-product-commission">{product.commission}</span>
                    </div>
                    <p className="workspace-product-name">{product.name}</p>
                    <CopyButton text={product.link} id={`product-${idx}`} copiedId={copiedId} onCopy={onCopy} label="링크 복사" />
                  </div>
                ))}
              </Section>

              <Section title="🔗 인포크 링크" copyText={analysis?.inpock?.url} copyId="inpock" copiedId={copiedId} onCopy={onCopy}>
                <p className="workspace-inpock-title">{analysis?.inpock?.title}</p>
                <a href={analysis?.inpock?.url} target="_blank" rel="noreferrer" className="workspace-inpock-url">
                  {analysis?.inpock?.url}
                </a>
                <p className="workspace-inpock-desc">{analysis?.inpock?.description}</p>
              </Section>
            </>
          )}

          {(activeTab === 'overview' || activeTab === 'translate') && (
            <>
              <Section title="🌏 중국어 번역" copyText={analysis?.chineseTranslation} copyId="chinese" copiedId={copiedId} onCopy={onCopy}>
                <p className="workspace-mono">{analysis?.chineseTranslation}</p>
              </Section>

              <Section
                title="📕 샤오홍슈 검색어"
                copyText={analysis?.xiaohongshuKeywords?.join(', ')}
                copyId="xhs"
                copiedId={copiedId}
                onCopy={onCopy}
              >
                <div className="workspace-tags">
                  {analysis?.xiaohongshuKeywords?.map((kw, i) => (
                    <span key={i} className="workspace-tag workspace-tag--rose">#{kw}</span>
                  ))}
                  {analysis?.chineseKeywords?.map((kw, i) => (
                    <span key={`cn-${i}`} className="workspace-tag workspace-tag--indigo">{kw}</span>
                  ))}
                </div>
              </Section>
            </>
          )}

          {(activeTab === 'overview' || activeTab === 'script') && (
            <>
              <div className="workspace-tone-selector">
                <span>대본 화법</span>
                <div className="workspace-tones">
                  {TONES.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      className={`workspace-tone-btn ${scriptTone === tone.id ? 'workspace-tone-btn--active' : ''}`}
                      onClick={() => onToneChange(tone.id)}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>

              <Section title="🎬 30초 대본" copyText={analysis?.script30s} copyId="script30" copiedId={copiedId} onCopy={onCopy}>
                <pre className="workspace-script">{analysis?.script30s}</pre>
              </Section>

              <Section title="🎬 60초 대본" copyText={analysis?.script60s} copyId="script60" copiedId={copiedId} onCopy={onCopy}>
                <pre className="workspace-script">{analysis?.script60s}</pre>
              </Section>
            </>
          )}

          {(activeTab === 'overview' || activeTab === 'thumbnail') && (
            <Section
              title="🖼 썸네일 문구"
              copyText={analysis?.thumbnailCopy?.join('\n')}
              copyId="thumbnail"
              copiedId={copiedId}
              onCopy={onCopy}
            >
              {analysis?.thumbnailCopy?.map((copy, idx) => (
                <div key={idx} className="workspace-thumbnail-item" onClick={() => onCopy(copy, `thumb-${idx}`)}>
                  <span>{copy}</span>
                  <CopyButton text={copy} id={`thumb-${idx}`} copiedId={copiedId} onCopy={onCopy} />
                </div>
              ))}
            </Section>
          )}
        </div>
      ) : (
        <p className="workspace-error">분석 데이터를 생성하지 못했습니다.</p>
      )}

      <div className="workspace-footer">
        <span>원문 동영상</span>
        <a href={selectedCard.sourceUrl} target="_blank" rel="noreferrer">
          바로가기 ↗
        </a>
      </div>
    </div>
  );
}
