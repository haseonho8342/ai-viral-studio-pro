import '../styles/header.css';

const FILTERS = [
  { id: 'realtime', label: '실시간', icon: '🔥' },
  { id: 'recommended', label: '추천순', icon: '⭐' },
  { id: 'today', label: '오늘', icon: '📅' },
  { id: 'thisWeek', label: '이번주', icon: '📆' },
  { id: 'thisMonth', label: '이번달', icon: '🗓' },
];

export default function FilterBar({ sortBy, onSortChange, onRefresh, isRefreshing }) {
  return (
    <div className="filter-bar">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`filter-btn ${sortBy === filter.id ? 'filter-btn--active' : ''}`}
          onClick={() => onSortChange(filter.id)}
        >
          <span>{filter.icon}</span>
          {filter.label}
        </button>
      ))}

      <div className="filter-divider" />

      <button
        type="button"
        className={`filter-refresh ${isRefreshing ? 'filter-refresh--loading' : ''}`}
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <span className="filter-refresh-icon">🔄</span>
        {isRefreshing ? '동기화 중...' : '새로고침'}
      </button>
    </div>
  );
}
