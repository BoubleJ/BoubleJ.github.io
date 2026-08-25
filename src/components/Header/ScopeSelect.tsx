import { useEffect, useRef, useState } from "react";
import * as styles from "./ScopeSelect.css";

const OPTIONS = [
  { value: "", label: "전체" },
  { value: "title", label: "제목" },
  { value: "content", label: "본문" },
];

interface ScopeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

// 네이티브 <select>를 대체하는 커스텀 드롭다운 (기능 동일: 전체/제목/본문 범위 선택)
export default function ScopeSelect({ value, onChange }: ScopeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  useEffect(() => {
    if (!isOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const select = (v: string) => {
    onChange(v);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="검색 범위"
        onClick={() => setIsOpen((o) => !o)}
      >
        <span>{current.label}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <ul className={styles.list} aria-label="검색 범위 선택">
          {OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                className={`${styles.option} ${o.value === value ? styles.optionActive : ""}`}
                aria-pressed={o.value === value}
                onClick={() => select(o.value)}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
