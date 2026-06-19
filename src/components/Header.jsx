import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import '../styles/header.css';

export default function Header({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  onRefresh,
  isRefreshing,
}) {
  return (
    <header className="header">
      <SearchBar value={search} onChange={onSearchChange} />
      <FilterBar
        sortBy={sortBy}
        onSortChange={onSortChange}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
    </header>
  );
}
