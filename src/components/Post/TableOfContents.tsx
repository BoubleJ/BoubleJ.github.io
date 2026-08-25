import type { MarkdownHeading } from "astro";
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
