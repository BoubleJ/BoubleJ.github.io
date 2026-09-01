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

  // 스펙 v2-9: IntersectionObserver 스크롤 스파이 — 현재 뷰포트에 걸린 섹션의 목차 링크를 강조
  useEffect(() => {
    const headingEls = [
      ...document.querySelectorAll<HTMLElement>(
        ".markdown-content h1[id], .markdown-content h2[id], .markdown-content h3[id]",
      ),
    ];
    // 헤딩 id → TOC 링크 (href는 퍼센트 인코딩이므로 디코드해서 매칭)
    const links = new Map<string, HTMLAnchorElement>(
      [
        ...document.querySelectorAll<HTMLAnchorElement>(
          'nav[aria-label="목차"] a[href^="#"]',
        ),
      ].map((a) => [decodeURIComponent(a.hash.slice(1)), a]),
    );

    // 목차가 길면 tocScrollArea에 스크롤이 생기므로 활성 링크를 이 영역 안으로 끌어옴
    const scrollArea = document.querySelector<HTMLElement>(
      `nav[aria-label="목차"] .${styles.tocScrollArea}`,
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // scrollIntoView는 페이지까지 함께 움직이므로 컨테이너 scrollTop만 직접 보정
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

    // 고정 헤더(70px)+여유를 rootMargin 상단 -80px로 보정, 하단 -60%로 "화면 상단부에 있는 헤딩"을 현재 섹션으로 판정
    const io = new IntersectionObserver(
      () => {
        // 관찰 콜백마다 '뷰포트 상단(80px) 위를 지나간 마지막 헤딩'을 현재 섹션으로 계산
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

    // 클릭 시 즉시 활성(스크롤 애니메이션 완료 전 반응성) — 이후 스파이가 이어받음
    // 해시 이동은 anchor-history.ts가 replaceState로 처리해 hashchange가 발생하지 않으므로 클릭 기반
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
    // DOM(.markdown-content)만 조회하며 headings prop 값 자체는 참조하지 않음 — 마운트 시 1회 실행
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
