import CloseIcon from "@/components/icon/CloseIcon";
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
    clearTerm,
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
            <div className={styles.searchInputWrapper}>
              <input
                ref={searchInputRef}
                type="text"
                value={term}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className={styles.searchInput}
                placeholder="궁금한 내용을 검색해보세요"
              />
              {term && (
                <button
                  type="button"
                  className={styles.clearTermButton}
                  onClick={clearTerm}
                  aria-label="검색어 지우기"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>
            <button type="submit" className={styles.searchButton}>
              검색
            </button>
          </form>
        </div>
      </div>

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
