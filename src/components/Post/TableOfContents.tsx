import { RefObject, useEffect, useState } from "react";
import * as styles from "./TableOfContents.css";

export interface TocItem {
  id: string;
  text: string;
  level: number; // 1 | 2 | 3 | 4 (h1, h2, h3, h4)
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w가-힣-]/g, "");
}

function getTocItems(container: HTMLElement): TocItem[] {
  const headings =
    container.querySelectorAll<HTMLHeadingElement>("h1, h2, h3, h4");
  const items: TocItem[] = [];
  const seen = new Set<string>();

  headings.forEach((el) => {
    const level = Number(el.tagName.charAt(1)) as 1 | 2 | 3 | 4;
    const text = el.textContent?.trim() ?? "";
    let id = el.id;

    if (!id) {
      const base = slugify(text);
      id = base;
      let suffix = 0;
      while (seen.has(id)) {
        suffix += 1;
        id = `${base}-${suffix}`;
      }
      el.id = id;
    }
    seen.add(id);
    items.push({ id, text, level });
  });

  return items;
}

interface TableOfContentsProps {
  contentRef: RefObject<HTMLDivElement | null>;
}

export default function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    setItems(getTocItems(container));
  }, [contentRef]);

  if (items.length === 0) return null;

  const getItemClass = (level: number) => {
    if (level === 1) return styles.tocItemLevel1;
    if (level === 2) return styles.tocItemLevel2;
    if (level === 3) return styles.tocItemLevel3;
    return styles.tocItemLevel4;
  };

  return (
    <nav className={styles.tocWrapper} aria-label="목차">
      <div className={styles.tocTitle}>목차</div>
      <ul className={styles.tocList}>
        {items.map(({ id, text, level }) => (
          <li key={id} className={`${styles.tocItem} ${getItemClass(level)}`}>
            <a
              href={`#${id}`}
              className={styles.tocLink}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
