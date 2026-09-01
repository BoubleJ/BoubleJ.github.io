// src/pages/search-index.json.ts — 빌드 타임에 정적 JSON으로 출력됨 (본문 전문 검색용, 스펙 v2-6)

import { getSortedPosts, toPostSummary } from "@/lib/posts";
import type { CollectionEntry } from "astro:content";

const stripMdx = (raw: string) =>
  raw
    .replace(/```[\s\S]*?```/g, " ") // 코드펜스 제외 (검색 노이즈 방지)
    .replace(/<[^>]+>/g, " ") // HTML/JSX 태그 제거
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // 이미지 문법 제거
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 링크 → 앵커 텍스트만
    .replace(/^---[\s\S]*?---/, " ") // frontmatter 제거
    .replace(/\s+/g, " ")
    .trim();

export async function GET() {
  const posts = await getSortedPosts();
  const index = await Promise.all(
    posts.map(async (p: CollectionEntry<"posts">) => ({
      ...(await toPostSummary(p)),
      body: stripMdx(p.body ?? ""),
    })),
  );
  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
}
