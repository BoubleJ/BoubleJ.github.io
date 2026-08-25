import { type ReactNode, useEffect, useRef } from "react";
import type { IndexedPost } from "@/hooks/useSearch";
import * as styles from "./SearchDropdown.css";

interface SearchDropdownProps {
  isOpen: boolean;
  matches: IndexedPost[];
  term: string;
  onSelect: (slug: string) => void;
  onClose: () => void;
}

// 제목 중 매칭된 부분만 <mark>로 감싼다 (대소문자 무시, 첫 매칭 1건만)
const highlightTitle = (title: string, term: string): ReactNode => {
  const t = term.trim();
  if (!t) return title;
  const idx = title.toLowerCase().indexOf(t.toLowerCase());
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx)}
      <mark className={styles.mark}>{title.slice(idx, idx + t.length)}</mark>
      {title.slice(idx + t.length)}
    </>
  );
};

export default function SearchDropdown({
  isOpen,
  matches,
  term,
  onSelect,
  onClose,
}: SearchDropdownProps) {
  const containerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || matches.length === 0) return null;

  return (
    <ul ref={containerRef} className={styles.dropdown}>
      {matches.map((post) => (
        <li key={post.id}>
          <button
            type="button"
            className={styles.item}
            onClick={() => onSelect(post.slug)}
          >
            <span className={styles.title}>{highlightTitle(post.title, term)}</span>
            <span className={styles.summary}>{post.summary}</span>
            <span className={styles.date}>{post.date}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
