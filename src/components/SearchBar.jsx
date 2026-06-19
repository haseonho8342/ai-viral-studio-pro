import '../styles/header.css';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-bar-icon">🔍</span>
      <input
        type="text"
        className="search-bar-input"
        placeholder="검색할 키워드, 카테고리 또는 크리에이터 입력..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
