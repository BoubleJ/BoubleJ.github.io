import type { MouseEvent } from "react";
import * as styles from "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hrefForPage: (page: number) => string;
}

type PageEntry = number | "ellipsis";

const buildPageEntries = (currentPage: number, totalPages: number): PageEntry[] => {
  const keep = new Set<number>([1, totalPages]);
  for (let p = currentPage - 2; p <= currentPage + 2; p++) {
    if (p >= 1 && p <= totalPages) keep.add(p);
  }
  const sorted = [...keep].sort((a, b) => a - b);
  const entries: PageEntry[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) entries.push("ellipsis");
    entries.push(p);
    prev = p;
  }
  return entries;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hrefForPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const entries = buildPageEntries(currentPage, totalPages);

  const handleClick = (page: number) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onPageChange(page);
  };

  return (
    <nav className={styles.pagination} aria-label="포스트 목록 페이지네이션">
      {currentPage <= 1 ? (
        <button
          type="button"
          className={styles.navButton}
          aria-label="이전 페이지로 이동"
          disabled
        >
          이전
        </button>
      ) : (
        <a
          href={hrefForPage(currentPage - 1)}
          className={styles.navButton}
          aria-label="이전 페이지로 이동"
          rel="prev"
          onClick={handleClick(currentPage - 1)}
        >
          이전
        </a>
      )}
      {entries.map((entry, i) =>
        entry === "ellipsis" ? (
          <span
            key={`ellipsis-before-${entries[i + 1]}`}
            className={styles.ellipsis}
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <a
            key={entry}
            href={hrefForPage(entry)}
            className={
              entry === currentPage
                ? `${styles.pageButton} ${styles.pageButtonActive}`
                : styles.pageButton
            }
            aria-label={`${entry}페이지로 이동`}
            aria-current={entry === currentPage ? "page" : undefined}
            onClick={handleClick(entry)}
          >
            {entry}
          </a>
        ),
      )}
      {currentPage >= totalPages ? (
        <button
          type="button"
          className={styles.navButton}
          aria-label="다음 페이지로 이동"
          disabled
        >
          다음
        </button>
      ) : (
        <a
          href={hrefForPage(currentPage + 1)}
          className={styles.navButton}
          aria-label="다음 페이지로 이동"
          rel="next"
          onClick={handleClick(currentPage + 1)}
        >
          다음
        </a>
      )}
    </nav>
  );
}
