import type { MarkdownHeading } from "astro";
import { useEffect } from "react";
import * as styles from "./TableOfContents.css";

interface TableOfContentsProps {
  headings: MarkdownHeading[];
}

interface TocNode {
  heading: MarkdownHeading;
  children: TocNode[];
}

const buildTree = (headings: MarkdownHeading[]): TocNode[] => {
  const items = headings.filter((h) => h.depth <= 3);
  const root: TocNode[] = [];
  const stack: { depth: number; nodes: TocNode[] }[] = [{ depth: 0, nodes: root }];

  for (const h of items) {
    while (stack.length > 1 && h.depth <= stack[stack.length - 1].depth) stack.pop();
    const node: TocNode = { heading: h, children: [] };
    stack[stack.length - 1].nodes.push(node);
    stack.push({ depth: h.depth, nodes: node.children });
  }

  return root;
};

const TocList = ({ nodes }: { nodes: TocNode[] }) => (
  <ul>
    {nodes.map((n) => (
      <li key={n.heading.slug}>
        <a className={styles.tocLink} href={`#${encodeURIComponent(n.heading.slug)}`}>
          {n.heading.text}
        </a>
        {n.children.length > 0 && <TocList nodes={n.children} />}
      </li>
    ))}
  </ul>
);

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const tree = buildTree(headings);

  useEffect(() => {
    const headingEls = [
      ...document.querySelectorAll<HTMLElement>(
        ".markdown-content h1[id], .markdown-content h2[id], .markdown-content h3[id]",
      ),
    ];
    const links = new Map<string, HTMLAnchorElement>(
      [
        ...document.querySelectorAll<HTMLAnchorElement>(
          'nav[aria-label="목차"] a[href^="#"]',
        ),
      ].map((a) => [decodeURIComponent(a.hash.slice(1)), a]),
    );

    const scrollArea = document.querySelector<HTMLElement>(
      `nav[aria-label="목차"] .${styles.tocScrollArea}`,
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const revealInScrollArea = (a: HTMLAnchorElement) => {
      if (!scrollArea || scrollArea.scrollHeight <= scrollArea.clientHeight) return;

      const areaRect = scrollArea.getBoundingClientRect();
      const linkRect = a.getBoundingClientRect();
      const margin = 8;

      let delta = 0;
      if (linkRect.top < areaRect.top + margin) {
        delta = linkRect.top - (areaRect.top + margin);
      } else if (linkRect.bottom > areaRect.bottom - margin) {
        delta = linkRect.bottom - (areaRect.bottom - margin);
      }
      if (delta === 0) return;

      scrollArea.scrollTo({
        top: scrollArea.scrollTop + delta,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    };

    let activeId = "";
    const setActive = (id: string) => {
      if (id === activeId) return;
      activeId = id;
      links.forEach((a, key) => {
        a.classList.toggle(styles.tocLinkActive, key === id);
      });
      const active = links.get(id);
      if (active) revealInScrollArea(active);
    };

    const io = new IntersectionObserver(
      () => {
        const current =
          headingEls.filter((h) => h.getBoundingClientRect().top <= 81).at(-1) ??
          headingEls[0];
        if (current) setActive(current.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: [0, 1] },
    );
    headingEls.forEach((h) => {
      io.observe(h);
    });

    const nav = document.querySelector('nav[aria-label="목차"]');
    const onNavClick = (e: Event) => {
      const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (a) setActive(decodeURIComponent(a.hash.slice(1)));
    };
    nav?.addEventListener("click", onNavClick);

    return () => {
      io.disconnect();
      nav?.removeEventListener("click", onNavClick);
    };
  }, []);

  if (tree.length === 0) return null;

  return (
    <nav aria-label="목차" className={styles.tocWrapper}>
      <div className={styles.tocTitle}>목차</div>
      <div className={styles.tocScrollArea}>
        <div className={styles.tocList}>
          <TocList nodes={tree} />
        </div>
      </div>
    </nav>
  );
}
