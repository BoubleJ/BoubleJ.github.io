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

  // /?search= 프리필 — 검색어와 범위만 input에 채워두고 아코디언은 닫힌 채로 둡니다.
  // 검색 결과 페이지에서 현재 조건은 본문 제목이 밝히므로 헤더까지 펼칠 이유가 없고,
  // 펼침 트랜지션이 진입할 때마다 재생되어 어색했습니다. 사용자가 열면 검색어가 그대로 남아 있습니다.
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
