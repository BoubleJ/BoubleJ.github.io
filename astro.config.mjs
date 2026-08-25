// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import remarkSmartypants from "remark-smartypants";
import rehypeExternalLinks from "rehype-external-links";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
// Task 5 완료 전까지 아래 1줄은 주석 처리
// import { rehypeAutolinkHeaders } from "./src/lib/rehype-autolink-headers.mjs";

export default defineConfig({
  site: "https://boublej.github.io",
  trailingSlash: "always",          // Gatsby 5 기본값과 동일
  build: { format: "directory" },   // /slug/index.html — 기존 URL 보존
  integrations: [react(), mdx(), sitemap()], // mdx는 아래 markdown 설정을 상속(extendMarkdownConfig 기본 true)
  vite: { plugins: [vanillaExtractPlugin()] },
  markdown: {
    syntaxHighlight: "prism",       // Shiki 대신 Prism — 기존 클래스 체계/테마 CSS 유지
    smartypants: false,             // 기본 옵션 대신 oldschool 대시 옵션으로 직접 지정
    remarkPlugins: [[remarkSmartypants, { dashes: "oldschool" }]],
    rehypePlugins: [
      rehypeHeadingIds,             // 커스텀 플러그인보다 먼저 id 주입 (Astro 문서 권장 방식)
      // rehypeAutolinkHeaders,        // Task 5에서 작성
      [rehypeExternalLinks, { target: "_blank", rel: ["nofollow", "noopener"] }], // v2-16 B2
    ],
  },
});
