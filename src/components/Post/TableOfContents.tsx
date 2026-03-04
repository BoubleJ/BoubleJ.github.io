import { useEffect } from "react";
import * as styles from "./TableOfContents.css";

interface TableOfContentsProps {
  tocHtml?: string | null;
}

const updateActiveTocLink = () => {
  if (typeof window === "undefined") return;

  const tocNav = document.querySelector<HTMLElement>('nav[aria-label="목차"]');
  if (!tocNav) return;

  const { hash } = window.location;
  const links = tocNav.querySelectorAll<HTMLAnchorElement>("a[href^='#']");

  links.forEach((link) => {
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

    updateActiveTocLink();

    const handleHashChange = () => {
      updateActiveTocLink();
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
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
