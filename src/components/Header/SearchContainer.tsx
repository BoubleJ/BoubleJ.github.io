import useSearch from "@/hooks/useSearch";
import * as styles from "./SearchContainer.css";

interface SearchContainerProps {
  isSearchOpen: boolean;
  onSearchClose: () => void;
}

export default function SearchContainer({
  isSearchOpen,
  onSearchClose,
}: SearchContainerProps) {
  const { handleSearchSubmit, searchInputRef } = useSearch({
    isSearchOpen,
    onSearchClose,
  });

  return (
    <div
      className={`${styles.searchContainer} ${isSearchOpen ? styles.searchContainerOpen : styles.searchContainerClosed}`}
    >
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <input
          ref={searchInputRef}
          type="text"
          className={styles.searchInput}
          placeholder="포스트 제목, 요약으로 검색..."
        />
        <button type="submit" className={styles.searchButton}>
          검색
        </button>
      </form>
    </div>
  );
}
