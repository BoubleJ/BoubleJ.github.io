// src/components/PostList/Pagination.tsx — 신규 UI (스펙 v2-8)
// [이전][1..N][다음], 현재 페이지는 primary 강조, 페이지가 많으면 현재±2 + 처음/끝 + 말줄임
// SEO: 페이지 이동을 <button>이 아닌 <a href>로 렌더한다. 크롤러는 onClick을 발동시키지 않고
// href만 따라가므로, 버튼이면 2페이지 이후의 글이 링크로 도달 불가능해진다.
// 실제 이동은 onClick에서 preventDefault 후 클라이언트 사이드로 처리해 기존 UX를 유지한다.
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
    // 새 탭/새 창으로 여는 조작(⌘·Ctrl·Shift 클릭 등)은 브라우저 기본 동작에 맡긴다
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
          // 말줄임 다음은 항상 실제 페이지 번호이므로 이를 이용해 안정적인 key를 만든다
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
