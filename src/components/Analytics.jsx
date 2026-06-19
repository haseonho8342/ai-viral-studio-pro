import { useState } from 'react';
import PageHeader from './PageHeader';
import { MOCK_ANALYTICS } from '../data/pageData';
import '../styles/pages.css';

export default function Analytics() {
  const [channelTab, setChannelTab] = useState('tiktok');
  const { stats, viralTrends, categoryShare, channels } = MOCK_ANALYTICS;

  return (
    <div className="page-view">
      <PageHeader
        icon="📊"
        title="분석 리포트"
        description="틱톡/유튜브 채널의 쿠팡 파트너스 전환 현황, 노출 증가세 및 카테고리 기여도를 진단합니다."
      />

      <div className="page-stat-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="page-stat-card">
            <p className="page-stat-label">{stat.icon} {stat.title}</p>
            <p className="page-stat-value">{stat.value}</p>
            <div className="page-stat-footer">
              <span className="page-stat-change">{stat.change}</span>
              <span>{stat.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="page-grid page-grid--8-4">
        <div className="page-card">
          <h3 className="page-card-title">📈 7일 바이럴 유입 트렌드</h3>
          <div className="page-chart">
            <div className="page-chart-bars">
              {viralTrends.map((trend, i) => (
                <div key={i} className="page-chart-bar-wrap">
                  <span className="page-chart-tooltip">{trend.count}K · CTR {trend.clickRate}</span>
                  <div className="page-chart-bar" style={{ height: `${trend.height}%` }} />
                  <span className="page-chart-date">{trend.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="page-card">
          <h3 className="page-card-title">🥧 카테고리 기여 비중</h3>
          {categoryShare.map((cat) => (
            <div key={cat.name} className="page-progress-item">
              <div className="page-progress-header">
                <span className="page-progress-name">
                  <span className="page-progress-dot" style={{ background: cat.color }} />
                  {cat.name}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{cat.value}%</span>
              </div>
              <div className="page-progress-bar">
                <div className="page-progress-fill" style={{ width: `${cat.value}%`, background: cat.color }} />
              </div>
            </div>
          ))}

          <div className="page-info-box page-info-box--indigo" style={{ marginTop: '1rem' }}>
            <strong>💡 크리에이터 진단</strong>
            리빙/아이디어 + IT 카테고리가 70% 이상을 차지합니다. 네온 보색 썸네일 카피로 전환율 1.5%p 향상이 가능합니다.
          </div>
        </div>
      </div>

      <div className="page-card">
        <h3 className="page-card-title">🏆 TOP 크리에이터 랭킹</h3>
        <div className="channel-tabs">
          <button type="button" className={`channel-tab ${channelTab === 'tiktok' ? 'channel-tab--active' : ''}`} onClick={() => setChannelTab('tiktok')}>TikTok</button>
          <button type="button" className={`channel-tab ${channelTab === 'youtube' ? 'channel-tab--active' : ''}`} onClick={() => setChannelTab('youtube')}>YouTube</button>
        </div>
        <div className="page-table-wrap">
          <table className="page-table">
            <thead>
              <tr>
                <th>순위</th>
                <th>계정</th>
                <th className="text-right">팔로워/구독</th>
                <th className="text-right">평균 조회</th>
                <th className="text-right">예상 수익</th>
              </tr>
            </thead>
            <tbody>
              {channels[channelTab].map((ch) => (
                <tr key={ch.rank}>
                  <td style={{ fontWeight: 800, color: '#a5b4fc' }}>#{ch.rank}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ch.account}</td>
                  <td className="text-right" style={{ fontFamily: 'var(--font-mono)' }}>{ch.followers || ch.sub}</td>
                  <td className="text-right" style={{ fontFamily: 'var(--font-mono)' }}>{ch.viewsAvg}</td>
                  <td className="text-right" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#6ee7b7' }}>{ch.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
