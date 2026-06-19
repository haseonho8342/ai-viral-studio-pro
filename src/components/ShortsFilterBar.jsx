import '../styles/header.css';

const SHORTS_FILTERS = [
  { id: 'views', label: '조회수', icon: '👁' },
  { id: 'likes', label: '좋아요', icon: '❤️' },
  { id: 'viral', label: '바이럴', icon: '🔥' },
];

export default function ShortsFilterBar({ sortBy, onSortChange, onRefresh, isRefreshing }) {
  return (
    <div className="filter-bar">
      {SHORTS_FILTERS.map((filter) => (
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
