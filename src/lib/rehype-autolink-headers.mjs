// src/lib/rehype-autolink-headers.mjs
// gatsby-remark-autolink-headers 재현 (스펙 §3-7). 전제: rehypeHeadingIds가 먼저 실행됨
import { visit } from "unist-util-visit";
import { fromHtml } from "hast-util-from-html";
import { toString } from "hast-util-to-string";

// gatsby-config.js의 icon 옵션 SVG 원본 그대로
const ICON_SVG = `<svg viewBox="0 0 16 16" height="0.7em" width="0.7em"> <g stroke-width="1.2" fill="none" stroke="currentColor"> <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M8.995,7.005 L8.995,7.005c1.374,1.374,1.374,3.601,0,4.975l-1.99,1.99c-1.374,1.374-3.601,1.374-4.975,0l0,0c-1.374-1.374-1.374-3.601,0-4.975 l1.748-1.698"></path>  <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M7.005,8.995 L7.005,8.995c-1.374-1.374-1.374-3.601,0-4.975l1.99-1.99c1.374-1.374,3.601-1.374,4.975,0l0,0c1.374,1.374,1.374,3.601,0,4.975 l-1.748,1.698"></path></g></svg>`;
const iconTree = fromHtml(ICON_SVG, { fragment: true, space: "svg" }).children;

export function rehypeAutolinkHeaders() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (!["h1", "h2", "h3"].includes(node.tagName)) return;
      const id = node.properties?.id;
      if (!id) return;
      node.properties.style = "position:relative;";
      node.children.unshift({
        type: "element",
        tagName: "a",
        properties: {
          href: `#${encodeURIComponent(String(id))}`,
          ariaLabel: `${toString(node)} permalink`,
          className: ["autolink-header", "before"],
        },
        children: structuredClone(iconTree),
      });
    });
  };
}
