// src/components/PostList/PostPageClient.tsx — 기존 post.tsx 로직 이식 (스펙 v2-1)
// v2-16 B1: query-string 대신 표준 URLSearchParams. 파싱 규칙 유지: category는 truthy만, search는 빈 문자열 허용
import { useEffect, useState } from "react";
import type { PostSummary } from "@/lib/posts";
// 페이지 제목/개수 스타일은 기존 post.css.ts 이동본에서 — 실제 export명 사용
import {
  pageTitle,
  pageTitleSearch,
  postCount,
  postsPage,
  searchTermMark,
} from "@/pages-styles/post.css";
import PostList from "./PostList";

interface SearchIndexEntry {
  slug: string;
  body: string;
}

export default function PostPageClient({ posts }: { posts: PostSummary[] }) {
  const [{ category, search, scope }, setParams] = useState({
    category: "",
    search: "",
    scope: "",
  });
  const [bodyIndex, setBodyIndex] = useState<Map<string, string> | null>(null); // slug → body plain text

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const search = sp.get("search") ?? "";
    const rawScope = sp.get("scope");
    const scope = rawScope === "title" || rawScope === "content" ? rawScope : "";
    setParams({ category: sp.get("category") || "", search, scope });
    // 본문 검색이 필요할 때만 인덱스 로드 (scope=content 또는 전체 검색) — 스펙 v2-6
    if (search.trim() && scope !== "title") {
      fetch("/search-index.json")
        .then((r) => r.json())
        .then((idx: SearchIndexEntry[]) =>
          setBodyIndex(new Map(idx.map((p) => [p.slug, p.body]))),
        );
    }
  }, []);

  // 검색 범위를 문구로 풀어 쓴다. 본문에서만 걸린 글은 카드에 하이라이트가 남지 않으므로
  // 어떤 범위로 찾았는지 여기서라도 밝혀야 결과를 납득할 수 있다.
  const scopeLabel =
    scope === "title" ? "제목과 요약에서 " : scope === "content" ? "본문에서 " : "";

  const term = search.trim().toLowerCase();
  const inTitle = (p: PostSummary) =>
    (p.title ?? "").toLowerCase().includes(term) ||
    (p.summary ?? "").toLowerCase().includes(term);
  const inBody = (p: PostSummary) =>
    (bodyIndex?.get(p.slug) ?? "").toLowerCase().includes(term);
  const filtered = !term
    ? posts
    : scope === "title"
      ? posts.filter(inTitle)
      : scope === "content"
        ? posts.filter(inBody)
        : posts.filter((p) => inTitle(p) || inBody(p));

  return (
    <div className={postsPage}>
      <h2 className={`${pageTitle} ${search ? pageTitleSearch : ""}`}>
        {search ? (
          <>
            <span className={searchTermMark}>{search}</span> 검색 결과
          </>
        ) : (
          "모든 포스트"
        )}
      </h2>
      {/* v2-14: 현재 조건의 포스트 개수 — 필터된 전체 기준(페이지 슬라이스 아님) */}
      <p className={postCount}>
        {scopeLabel}총 {filtered.length}개의 포스트
      </p>
      <PostList posts={filtered} selectedCategory={category} searchTerm={search} />
    </div>
  );
}
