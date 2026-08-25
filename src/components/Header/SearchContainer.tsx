import useSearch from "@/hooks/useSearch";
import * as styles from "./SearchContainer.css";
import SearchDropdown from "./SearchDropdown";

export interface InitialSearchQuery {
  term: string;
  scope: string;
}

interface SearchContainerProps {
  isSearchOpen: boolean;
  onSearchClose: () => void;
  initialQuery?: InitialSearchQuery | null;
}

export default function SearchContainer({
  isSearchOpen,
  onSearchClose,
  initialQuery,
}: SearchContainerProps) {
  const {
    handleSearchSubmit,
    searchInputRef,
    term,
    scope,
    matches,
    isDropdownOpen,
    handleSearchChange,
    handleScopeChange,
    handleSearchFocus,
    closeDropdown,
    handleResultSelect,
  } = useSearch({ isSearchOpen, onSearchClose, initialQuery });

  return (
    <div
      className={`${styles.searchContainer} ${isSearchOpen ? styles.searchContainerOpen : styles.searchContainerClosed}`}
    >
      <div className={styles.searchInner}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <select
            value={scope}
            onChange={handleScopeChange}
            className={styles.scopeSelect}
            aria-label="검색 범위"
          >
            <option value="">전체</option>
            <option value="title">제목</option>
            <option value="content">본문</option>
          </select>
          <input
            ref={searchInputRef}
            type="text"
            value={term}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            className={styles.searchInput}
            placeholder="포스트 제목, 요약, 본문으로 검색..."
          />
          <button type="submit" className={styles.searchButton}>
            검색
          </button>
        </form>
        <SearchDropdown
          isOpen={isDropdownOpen}
          matches={matches}
          term={term}
          onSelect={handleResultSelect}
          onClose={closeDropdown}
        />
      </div>
    </div>
  );
}
