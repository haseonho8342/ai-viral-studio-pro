import { useState } from 'react';
import PageHeader from './PageHeader';
import { isGeminiAvailable, generateScriptBlocks } from '../services/geminiService';
import '../styles/pages.css';

const DEFAULT_BLOCKS = [
  { time: '00:00 - 00:05', scene: '식초물에 과일 닦는 답답한 일상 흑백 화면', voice: '아직도 대야에 식초 붓고 사과 닦으세요? 미세 잔류농약 그대로 다 먹고 있습니다.', subtitle: '대야에 과일 닦는 분들 🚨' },
  { time: '00:05 - 00:15', scene: '초음파 버튼 누르자 이물질 분리 슬로우 모션', voice: '초고밀도 초음파가 30,000번 진동합니다. 야채, 젖병, 식기 이물질 극적 분리 완료.', subtitle: '초밀도 초음파! 💦 30,000회 살균' },
  { time: '00:15 - 00:25', scene: '광택 나는 과일 ASMR 한입 베어먹기', voice: '손 안 대고 물만 받아두면 5분 만에 세균 99% 박멸.', subtitle: '5분 만에 세균 박멸 🍎' },
  { time: '00:25 - 00:30', scene: '고정댓글 링크 손가락 강조', voice: '오늘만 45% 할인! 고정댓글 링크로 달려가세요!', subtitle: '💥 45% 한정특가!' },
];

export default function ScriptGenerator() {
  const [concept, setConcept] = useState('초음파로 야채와 식기 세척하는 무선 싱크 과일세척기');
  const [length, setLength] = useState('30s');
  const [tone, setTone] = useState('aggressive');
  const [blocks, setBlocks] = useState(DEFAULT_BLOCKS);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('mock');
  const [copied, setCopied] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (isGeminiAvailable()) {
        const result = await generateScriptBlocks(concept, length, tone);
        if (result.blocks?.length) {
          setBlocks(result.blocks);
          setSource('gemini');
        }
      } else {
        setBlocks([
          { time: '00:00 - 00:08', scene: `[${concept}] 사용 전 지저분한 상태`, voice: tone === 'aggressive' ? '절대 이 사실 모르고 쓰시면 손해입니다!' : '소문난 이 아이템, 같이 털어볼까요?', subtitle: `🚨 ${concept.substring(0, 10)} 비포애프터` },
          { time: '00:08 - 00:22', scene: '제품 작동 클로즈업', voice: '버튼 하나만 쓱 터치하면 알아서 해결됩니다.', subtitle: '간편 무선 작동! ⚡' },
          { time: '00:22 - 00:30', scene: '고정댓글 링크 강조', voice: '지금 한정 특가! 고정댓글 링크 클릭!', subtitle: '💥 한정특가 공구!' },
        ]);
        setSource('mock');
      }
    } catch {
      setBlocks(DEFAULT_BLOCKS);
      setSource('mock');
    }
    setLoading(false);
  };

  const copyAll = () => {
    const text = blocks.map((b) => `[${b.time}]\n장면: ${b.scene}\n나레이션: ${b.voice}\n자막: ${b.subtitle}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied('all');
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="page-view">
      <PageHeader
        icon="🎬"
        title="대본 생성기"
        description="상품 컨셉과 화법을 입력하면 30초/60초 쇼츠 대본을 장면별로 생성합니다."
      />

      <span className={`page-ai-badge page-ai-badge--${source}`}>
        {source === 'gemini' ? '✨ Gemini AI 연동' : '🤖 더미 엔진'}
      </span>

      <div className="page-grid page-grid--5-7">
        <div className="page-card page-space-y-lg">
          <h3 className="page-card-title">⚙️ 대본 설정</h3>
          <div>
            <label className="page-label">상품/컨셉</label>
            <textarea className="page-textarea" rows={2} value={concept} onChange={(e) => setConcept(e.target.value)} />
          </div>
          <div className="page-flex-row">
            {['30s', '60s'].map((l) => (
              <button key={l} type="button" className={`page-btn page-btn--outline page-btn--sm ${length === l ? '' : ''}`} style={length === l ? { borderColor: 'var(--accent-indigo)', color: '#a5b4fc' } : {}} onClick={() => setLength(l)}>
                {l === '30s' ? '30초' : '60초'}
              </button>
            ))}
          </div>
          <div className="page-flex-row">
            {[{ id: 'aggressive', label: '어그로형' }, { id: 'friendly', label: '친근형' }, { id: 'humor', label: '유머형' }].map((t) => (
              <button key={t.id} type="button" className="page-btn page-btn--outline page-btn--sm" style={tone === t.id ? { borderColor: 'var(--accent-indigo)', color: '#a5b4fc' } : {}} onClick={() => setTone(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <button type="button" className="page-btn" onClick={handleGenerate} disabled={loading}>
            {loading ? '🔄 생성 중...' : '✨ 대본 생성'}
          </button>
        </div>

        <div className="page-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 className="page-card-title" style={{ margin: 0, border: 'none', padding: 0 }}>📝 생성된 대본</h3>
            <button type="button" className="page-btn page-btn--outline page-btn--sm" onClick={copyAll}>
              {copied === 'all' ? '✓ 복사됨' : '전체 복사'}
            </button>
          </div>
          {blocks.map((block, idx) => (
            <div key={idx} className="script-block">
              <p className="script-block-time">{block.time}</p>
              <p className="script-block-scene">장면: {block.scene}</p>
              <p className="script-block-voice">&quot;{block.voice}&quot;</p>
              <p className="script-block-sub">{block.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
