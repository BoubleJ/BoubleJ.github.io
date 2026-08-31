// astro.config.mjs
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import remarkSmartypants from "remark-smartypants";
import rehypeExternalLinks from "rehype-external-links";
import { rehypeHeadingIds, unified } from "@astrojs/markdown-remark";
import { rehypeAutolinkHeaders } from "./src/lib/rehype-autolink-headers.mjs";

const SITE_URL = "https://boublej.github.io";

// 사이트맵 <lastmod>용 슬러그 → 작성일 맵.
// astro.config는 Astro 런타임 밖이라 astro:content(getCollection)를 쓸 수 없어
// frontmatter의 date를 파일에서 직접 읽는다. 슬러그 규칙은 content.config.ts의 generateId와 동일.
const POSTS_DIR = "./src/content/posts";
const postDateBySlug = new Map();
for (const dirent of fs.readdirSync(POSTS_DIR, { withFileTypes: true })) {
  if (!dirent.isDirectory()) continue;
  const file = path.join(POSTS_DIR, dirent.name, "index.mdx");
  if (!fs.existsSync(file)) continue;
  const date = fs.readFileSync(file, "utf-8").match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
  if (!date) continue;
  postDateBySlug.set(dirent.name.trim().replace(/\s+/g, "-"), date[1]);
}
// 목록 페이지(홈·태그)는 새 글이 올라올 때 내용이 바뀌므로 가장 최신 글 날짜를 쓴다
const latestPostDate = [...postDateBySlug.values()].sort().at(-1);

const toLastmod = (date) => new Date(`${date}T00:00:00Z`).toISOString();

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "always",          // Gatsby 5 기본값과 동일
  build: { format: "directory" },   // /slug/index.html — 기존 URL 보존
  integrations: [
    react(),
    mdx(), // mdx는 아래 markdown 설정을 상속(extendMarkdownConfig 기본 true)
    sitemap({
      // 각 URL에 작성일을 붙여 구글이 무엇이 새로 생겼는지 판별할 수 있게 한다
      serialize(item) {
        const slug = decodeURIComponent(item.url)
          .replace(`${SITE_URL}/`, "")
          .replace(/\/$/, "");
        const date = postDateBySlug.get(slug) ?? (slug === "" || slug === "tag" ? latestPostDate : undefined);
        if (date) item.lastmod = toLastmod(date);
        return item;
      },
    }),
  ],
  vite: { plugins: [vanillaExtractPlugin()] },
  markdown: {
    syntaxHighlight: "prism",       // Shiki 대신 Prism — 기존 클래스 체계/테마 CSS 유지
    // Astro 7부터 마크다운 엔진이 교체 가능한 processor 구조가 됐다.
    // 기본값은 Sätteri지만 remark/rehype 파이프라인을 유지하려면 unified()를 명시해야 한다.
    processor: unified({
      smartypants: false,           // 기본 옵션 대신 oldschool 대시 옵션으로 직접 지정
      remarkPlugins: [[remarkSmartypants, { dashes: "oldschool" }]],
      rehypePlugins: [
        rehypeHeadingIds,           // 커스텀 플러그인보다 먼저 id 주입 (Astro 문서 권장 방식)
        rehypeAutolinkHeaders,
        [rehypeExternalLinks, { target: "_blank", rel: ["nofollow", "noopener"] }], // v2-16 B2
      ],
    }),
  },
});
