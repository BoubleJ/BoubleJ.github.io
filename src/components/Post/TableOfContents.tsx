import { useEffect } from "react";
import * as styles from "./TableOfContents.css";

interface TableOfContentsProps {
  tocHtml?: string | null;
}

const HEADER_OFFSET = 80;

const scrollToHashWithOffset = (hash: string, behavior: ScrollBehavior = "smooth") => {
  if (typeof window === "undefined") return;
  if (!hash) return;

  const id = hash.replace(/^#/, "");
  const target = document.getElementById(decodeURIComponent(id));
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

  window.scrollTo({
    top,
    behavior,
  });
};

const updateActiveTocLink = () => {
  if (typeof window === "undefined") return;

  const tocNav = document.querySelector<HTMLElement>('nav[aria-label="목차"]');
  if (!tocNav) return;

  const { hash } = window.location;
  const links = tocNav.querySelectorAll<HTMLAnchorElement>("a[href^='#']");

  links.forEach((link) => {
    // 기본 TOC 링크 스타일 클래스 부여
    if (!link.classList.contains(styles.tocLink)) {
      link.classList.add(styles.tocLink);
    }

    if (hash && link.hash === hash) {
      link.classList.add(styles.tocLinkActive);
    } else {
      link.classList.remove(styles.tocLinkActive);
    }
  });
};

export default function TableOfContents({ tocHtml }: TableOfContentsProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.hash) {
      scrollToHashWithOffset(window.location.hash, "auto");
    }

    updateActiveTocLink();

    const handleHashChange = () => {
      scrollToHashWithOffset(window.location.hash, "smooth");
      updateActiveTocLink();
    };

    const handleTocClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest("a");
      if (!link || !(link instanceof HTMLAnchorElement)) return;

      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      event.preventDefault();

      const hash = href;

      scrollToHashWithOffset(hash, "smooth");

      if (window.location.hash !== hash) {
        window.location.hash = hash.slice(1);
      } else {
        updateActiveTocLink();
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    const tocNav = document.querySelector<HTMLElement>('nav[aria-label="목차"]');
    tocNav?.addEventListener("click", handleTocClick);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      tocNav?.removeEventListener("click", handleTocClick);
    };
  }, []);

  if (!tocHtml) return null;

  return (
    <nav aria-label="목차" className={styles.tocWrapper}>
      <div className={styles.tocTitle}>목차</div>
      <div className={styles.tocScrollArea}>
        <div className={styles.tocList} dangerouslySetInnerHTML={{ __html: tocHtml }} />
      </div>
    </nav>
  );
}
