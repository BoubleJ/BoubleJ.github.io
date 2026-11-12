import { useEffect, useState } from "react";
import type { PostSummary } from "@/lib/posts";
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
  const [bodyIndex, setBodyIndex] = useState<Map<string, string> | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const search = sp.get("search") ?? "";
    const rawScope = sp.get("scope");
    const scope = rawScope === "title" || rawScope === "content" ? rawScope : "";
    setParams({ category: sp.get("category") || "", search, scope });
    if (search.trim() && scope !== "title") {
      fetch("/search-index.json")
        .then((r) => r.json())
        .then((idx: SearchIndexEntry[]) =>
          setBodyIndex(new Map(idx.map((p) => [p.slug, p.body]))),
        );
    }
  }, []);

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

      <p className={postCount}>
        {scopeLabel}총 {filtered.length}개의 포스트
      </p>
      <PostList posts={filtered} selectedCategory={category} searchTerm={search} />
    </div>
  );
}
