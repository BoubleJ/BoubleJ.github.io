import { useState, useEffect, useRef } from "react";
import { Link, navigate } from "gatsby";
import { useLocation } from "@reach/router";
import * as styles from "./Header.css";
import { NAV_LINKS } from "@/constants";
import SearchIcon from "@/components/icon/SearchIcon";

function Header() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    
    if (trimmedSearchTerm) {
      navigate(`/post?search=${encodeURIComponent(trimmedSearchTerm)}`);
    } else {
      navigate(`/post`);
    }
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

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
              className={`${styles.navLink} ${isActive(path) ? styles.navLinkActive : ""}`}
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
      <div className={`${styles.searchContainer} ${isSearchOpen ? styles.searchContainerOpen : styles.searchContainerClosed}`}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            ref={searchInputRef}
            type="text"
            className={styles.searchInput}
            placeholder="포스트 제목, 요약으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            검색
          </button>
        </form>
      </div>
    </header>
  );
}

export default Header;
