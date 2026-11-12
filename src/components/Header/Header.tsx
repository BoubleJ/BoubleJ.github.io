import { useEffect, useState } from "react";
import SearchIcon from "@/components/icon/SearchIcon";
import ThemeIcon from "@/components/icon/ThemeIcon";
import { NAV_LINKS } from "@/constants";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import useHeader from "@/hooks/useHeader";
import * as styles from "./Header.css";
import SearchContainer, { type InitialSearchQuery } from "./SearchContainer";

interface HeaderProps {
  pathname: string;
}

const Header = ({ pathname }: HeaderProps) => {
  const { isSearchOpen, isVisible, handleSearchClose, handleSearchIconClick } =
    useHeader();
  const { toggleTheme } = useTheme();
  const [initialQuery, setInitialQuery] = useState<InitialSearchQuery | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    if (search) {
      setInitialQuery({ term: search, scope: params.get("scope") ?? "" });
    }
  }, []);

  return (
    <header
      className={`${styles.header} ${isVisible ? styles.headerVisible : styles.headerHidden}`}
    >
      <div className={styles.headerContainer}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoText}>Tech Blog</span>
        </a>
        <nav className={styles.nav}>
          {NAV_LINKS.map(({ path, label }) => (
            <a
              key={path}
              href={path}
              className={`${styles.navLink} ${pathname === path ? styles.navLinkActive : ""}`}
            >
              {label}
            </a>
          ))}
          <button
            type="button"
            className={`${styles.searchIconButton} ${isSearchOpen ? styles.searchIconButtonActive : ""}`}
            onClick={handleSearchIconClick}
            aria-label="검색"
            aria-pressed={isSearchOpen}
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
      <SearchContainer
        isSearchOpen={isSearchOpen}
        onSearchClose={handleSearchClose}
        initialQuery={initialQuery}
      />
    </header>
  );
};

export default function HeaderIsland(props: HeaderProps) {
  return (
    <ThemeProvider>
      <Header {...props} />
    </ThemeProvider>
  );
}
