// src/components/PostList/Pagination.tsx — 신규 UI (스펙 v2-8)
// [이전][1..N][다음], 현재 페이지는 primary 강조, 페이지가 많으면 현재±2 + 처음/끝 + 말줄임
import * as styles from "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const entries = buildPageEntries(currentPage, totalPages);

  return (
    <nav className={styles.pagination} aria-label="포스트 목록 페이지네이션">
      <button
        type="button"
        className={styles.navButton}
        aria-label="이전 페이지로 이동"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        이전
      </button>
      {entries.map((entry, i) =>
        entry === "ellipsis" ? (
          // 말줄임 다음은 항상 실제 페이지 번호이므로 이를 이용해 안정적인 key를 만든다
          <span
            key={`ellipsis-before-${entries[i + 1]}`}
            className={styles.ellipsis}
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            className={
              entry === currentPage
                ? `${styles.pageButton} ${styles.pageButtonActive}`
                : styles.pageButton
            }
            aria-label={`${entry}페이지로 이동`}
            aria-current={entry === currentPage ? "page" : undefined}
            onClick={() => onPageChange(entry)}
          >
            {entry}
          </button>
        ),
      )}
      <button
        type="button"
        className={styles.navButton}
        aria-label="다음 페이지로 이동"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        다음
      </button>
    </nav>
  );
}
