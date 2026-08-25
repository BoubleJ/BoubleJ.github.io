import useSearch from "@/hooks/useSearch";
import ScopeSelect from "./ScopeSelect";
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
    <div className={styles.searchPositioner}>
      <div
        className={`${styles.searchContainer} ${isSearchOpen ? styles.searchContainerOpen : styles.searchContainerClosed}`}
      >
        <div className={styles.searchInner}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <ScopeSelect value={scope} onChange={handleScopeChange} />
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
        </div>
      </div>
      {/* 오버레이: 아코디언(overflow hidden) 밖에 두어 잘리지 않고, 레이아웃에도 영향 없음 */}
      <div className={styles.dropdownOverlay}>
        <div className={styles.dropdownOverlayInner}>
          <SearchDropdown
            isOpen={isSearchOpen && isDropdownOpen}
            matches={matches}
            term={term}
            onSelect={handleResultSelect}
            onClose={closeDropdown}
          />
        </div>
      </div>
    </div>
  );
}
