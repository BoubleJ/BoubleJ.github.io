import fs from "node:fs";
import path from "node:path";
import { rehypeHeadingIds, unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import remarkSmartypants from "remark-smartypants";
import { rehypeAutolinkHeaders } from "./src/lib/rehype-autolink-headers.mjs";

const SITE_URL = "https://boublej.github.io";

const POSTS_DIR = "./src/content";
const postDateBySlug = new Map();
for (const dirent of fs.readdirSync(POSTS_DIR, { withFileTypes: true })) {
  if (!dirent.isDirectory()) continue;
  const file = path.join(POSTS_DIR, dirent.name, "index.mdx");
  if (!fs.existsSync(file)) continue;
  const date = fs
    .readFileSync(file, "utf-8")
    .match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
  if (!date) continue;
  postDateBySlug.set(dirent.name.trim().replace(/\s+/g, "-"), date[1]);
}
const latestPostDate = [...postDateBySlug.values()].sort().at(-1);

const toLastmod = (date) => new Date(`${date}T00:00:00Z`).toISOString();

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [
    react(),
    mdx(),
    sitemap({
      serialize(item) {
        const slug = decodeURIComponent(item.url)
          .replace(`${SITE_URL}/`, "")
          .replace(/\/$/, "");
        const date =
          postDateBySlug.get(slug) ??
          (slug === "" || slug === "tag" ? latestPostDate : undefined);
        if (date) item.lastmod = toLastmod(date);
        return item;
      },
    }),
  ],
  vite: { plugins: [vanillaExtractPlugin()] },
  markdown: {
    syntaxHighlight: "prism",
    processor: unified({
      smartypants: false,
      remarkPlugins: [[remarkSmartypants, { dashes: "oldschool" }]],
      rehypePlugins: [
        rehypeHeadingIds,
        rehypeAutolinkHeaders,
        [rehypeExternalLinks, { target: "_blank", rel: ["nofollow", "noopener"] }],
      ],
    }),
  },
});
