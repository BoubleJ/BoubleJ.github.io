import { Link } from "gatsby";
import SearchIcon from "@/components/icon/SearchIcon";
import ThemeIcon from "@/components/icon/ThemeIcon";
import { NAV_LINKS } from "@/constants";
import { useTheme } from "@/context/ThemeContext";
import useHeader from "@/hooks/useHeader";
import * as styles from "./Header.css";
import SearchContainer from "./SearchContainer";

interface HeaderProps {
  pathname: string;
}

export default function Header({ pathname }: HeaderProps) {
  const { isSearchOpen, isVisible, handleSearchClose, handleSearchIconClick } =
    useHeader();
  const { toggleTheme } = useTheme();

  return (
    <header
      className={`${styles.header} ${isVisible ? styles.headerVisible : styles.headerHidden}`}
    >
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
          <button
            type="button"
            className={styles.searchIconButton}
            onClick={toggleTheme}
            aria-label="테마 변경"
          >
            <ThemeIcon />
          </button>
        </nav>
      </div>
      <SearchContainer isSearchOpen={isSearchOpen} onSearchClose={handleSearchClose} />
    </header>
  );
}
