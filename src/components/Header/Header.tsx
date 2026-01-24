import { Link } from "gatsby";
import * as styles from "./Header.css";
import { NAV_LINKS } from "@/constants";
import SearchIcon from "@/components/icon/SearchIcon";
import SearchContainer from "./SearchContainer";
import useHeader from "@/hooks/useHeader";

interface HeaderProps {
  pathname: string;
}

export default function Header({ pathname }: HeaderProps) {
  const { isSearchOpen, isVisible, handleSearchClose, handleSearchIconClick } = useHeader();
  return (
    <header className={`${styles.header} ${isVisible ? styles.headerVisible : styles.headerHidden}`}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Tech Blog</span>
        </Link>
        <nav className={styles.nav}>
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`${styles.navLink} ${pathname === path ? styles.navLinkActive : ""}`}
            >
              {label}
            </Link>
          ))}
          <button
            type="button"
            className={styles.searchIconButton}
            onClick={handleSearchIconClick}
            aria-label="검색"
          >
            <SearchIcon />
          </button>
        </nav>
      </div>
      <SearchContainer isSearchOpen={isSearchOpen} onSearchClose={handleSearchClose} />
    </header>
  );
}

