// src/lib/posts.ts

import readingTime from "reading-time";
import { type CollectionEntry, getCollection } from "astro:content";

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  date: string;
  categories: string[];
  thumbnail: string;
}

// Gatsby(lodash orderBy) 정렬 = 코드포인트 비교 (스펙 §2)
const byDateThenTitleDesc = (
  a: CollectionEntry<"posts">,
  b: CollectionEntry<"posts">,
) => {
  if (a.data.date !== b.data.date) return a.data.date < b.data.date ? 1 : -1;
  if (a.data.title !== b.data.title) return a.data.title < b.data.title ? 1 : -1;
  return 0;
};

export const getSortedPosts = async () =>
  (await getCollection("posts")).sort(byDateThenTitleDesc);

// "2024-01-02" → "2024.01.02." (기존 formatString "YYYY.MM.DD.")
export const formatDate = (date: string) => `${date.replaceAll("-", ".")}.`;

// v2-16 A5: frontmatter 제외 본문만 입력 (기존 Gatsby의 "원문 전체 입력" 버그 폐기, 표시값 ±1분 허용)
export const getReadingTimeText = (
  entry: CollectionEntry<"posts">,
): string | undefined => (entry.body ? readingTime(entry.body).text : undefined); // 예: "9 min read"

export const toPostSummary = (p: CollectionEntry<"posts">): PostSummary => ({
  id: p.id,
  slug: `/${p.id}/`,
  title: p.data.title,
  summary: p.data.summary,
  date: formatDate(p.data.date),
  categories: p.data.categories,
  thumbnail: p.data.thumbnail,
});
