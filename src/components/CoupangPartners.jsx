import { useState } from 'react';
import PageHeader from './PageHeader';
import { COUPANG_PRODUCTS } from '../data/pageData';
import '../styles/pages.css';

export default function CoupangPartners() {
  const [search, setSearch] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(null);

  const filtered = COUPANG_PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const generateShort = () => {
    if (!customUrl.trim()) return;
    setShortUrl(`https://link.coupang.com/a/vstudio_${Math.floor(Math.random() * 90000 + 10000)}`);
  };

  return (
    <div className="page-view">
      <PageHeader
        icon="🛒"
        title="쿠팡 파트너스"
        description="바이럴 쇼츠 연계 상품 매칭, 제휴 링크 생성 및 수익 통계를 관리합니다."
      />

      <div className="page-grid page-grid--8-4">
        <div className="page-space-y-lg">
          <div className="page-card">
            <input
              className="page-input"
              placeholder="관심 상품 카테고리 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="page-table-wrap">
            <table className="page-table">
              <thead>
                <tr>
                  <th>상품명</th>
                  <th className="text-right">정가</th>
                  <th className="text-right">노출/전환</th>
                  <th className="text-right">수익</th>
                  <th className="text-center">링크</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => {
                  const cr = ((item.conversions / item.clicks) * 100).toFixed(1);
                  return (
                    <tr key={idx}>
                      <td>
                        <span style={{ fontSize: '0.625rem', color: '#6ee7b7', fontWeight: 700 }}>{item.category}</span>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.125rem' }}>{item.name}</div>
                      </td>
                      <td className="text-right" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₩{item.price.toLocaleString()}</td>
                      <td className="text-right" style={{ fontFamily: 'var(--font-mono)' }}>
                        {item.clicks.toLocaleString()} Clicks
                        <div style={{ fontSize: '0.625rem', color: '#6ee7b7' }}>전환 {cr}%</div>
                      </td>
                      <td className="text-right" style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#6ee7b7' }}>
                        +₩{item.commission.toLocaleString()}
                      </td>
                      <td className="text-center">
                        <button type="button" className="page-btn page-btn--outline page-btn--sm" onClick={() => copy(`https://link.coupang.com/a/auto_s_${idx}`, idx)}>
                          {copied === idx ? '✓' : '복사'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="page-info-box page-info-box--indigo">
            <strong>🛡️ 공정위 표기 가이드</strong>
            제휴 링크 노출 시 &quot;이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.&quot; 문구를 반드시 명기하세요.
          </div>
        </div>

        <div className="page-space-y-lg">
          <div className="page-card page-space-y">
            <h3 className="page-card-title">🔗 딥링크 단축 생성기</h3>
            <label className="page-label">쿠팡 상품 URL</label>
            <input className="page-input page-input--mono" placeholder="https://www.coupang.com/vp/products/..." value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} />
            <button type="button" className="page-btn" onClick={generateShort} disabled={!customUrl.trim()}>제휴 단축링크 변환</button>
            {shortUrl && (
              <div className="page-result">
                <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#a5b4fc', wordBreak: 'break-all' }}>{shortUrl}</p>
                <button type="button" className="page-btn page-btn--outline page-btn--sm" style={{ marginTop: '0.5rem' }} onClick={() => copy(shortUrl, 99)}>
                  {copied === 99 ? '✓ 복사됨' : '복사'}
                </button>
              </div>
            )}
          </div>

          <div className="page-info-box">
            <strong>💡 쇼츠 제휴 팁</strong>
            1. 영상 시작 3초에 어그로 후킹 · 2. 고정댓글 대신 인포크 링크 활용 · 3. 2~3만원대 리빙템이 전환율 1위
          </div>
        </div>
      </div>
    </div>
  );
}
